
import os
import json
import requests

from datetime import date
from decimal import Decimal, ROUND_HALF_UP

from sqlalchemy import func

from .. import db
from ..models import Transaction, Budget

from groq import Groq
from groq import (
    AuthenticationError,
    RateLimitError,
    APIConnectionError,
    APIStatusError
)

GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")

# Grok API configuration
GROK_URL = "https://api.x.ai/v1/responses"
GROK_MODEL = os.getenv("XAI_MODEL", "grok-4.7")


class AIServiceError(Exception):
    """Custom exception for AI service errors."""

    def __init__(self, message, status_code=502):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


def build_financial_report():
    """
    Retrieve and calculate the current month's financial data.
    All financial calculations are performed in Python.
    """

    today = date.today()

    month_start = today.replace(day=1)

    if today.month == 12:
        next_month_start = date(today.year + 1, 1, 1)
    else:
        next_month_start = date(today.year, today.month + 1, 1)

    # Calculate total income
    total_income = db.session.query(
        func.coalesce(func.sum(Transaction.amount), 0)
    ).filter(
        Transaction.type == "Income",
        Transaction.date >= month_start,
        Transaction.date < next_month_start
    ).scalar()

    # Calculate total expenses
    total_expenses = db.session.query(
        func.coalesce(func.sum(Transaction.amount), 0)
    ).filter(
        Transaction.type == "Expense",
        Transaction.date >= month_start,
        Transaction.date < next_month_start
    ).scalar()

    total_income = Decimal(str(total_income))
    total_expenses = Decimal(str(total_expenses))

    # Retrieve current month's budget
    budget = Budget.query.filter_by(
        month=today.month,
        year=today.year
    ).first()

    if budget:
        monthly_budget = Decimal(str(budget.monthly_limit))

        remaining_budget = monthly_budget - total_expenses

        budget_utilization = (
            total_expenses / monthly_budget * Decimal("100")
        ).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)

    else:
        monthly_budget = None
        remaining_budget = None
        budget_utilization = None

    # Retrieve expense totals grouped by category
    category_results = db.session.query(
        Transaction.category,
        func.sum(Transaction.amount)
    ).filter(
        Transaction.type == "Expense",
        Transaction.date >= month_start,
        Transaction.date < next_month_start
    ).group_by(
        Transaction.category
    ).all()

    category_breakdown = {
        category: str(Decimal(str(amount)).quantize(Decimal("0.01")))
        for category, amount in category_results
    }

    # Build financial report
    report = {
        "currency": "PKR",
        "period": {
            "month": today.month,
            "year": today.year
        },
        "total_income": str(total_income.quantize(Decimal("0.01"))),
        "total_expenses": str(total_expenses.quantize(Decimal("0.01"))),
        "balance": str(
            (total_income - total_expenses).quantize(Decimal("0.01"))
        ),
        "monthly_budget": (
            str(monthly_budget.quantize(Decimal("0.01")))
            if monthly_budget is not None else None
        ),
        "remaining_budget": (
            str(remaining_budget.quantize(Decimal("0.01")))
            if remaining_budget is not None else None
        ),
        "budget_utilization": (
            float(budget_utilization)
            if budget_utilization is not None else None
        ),
        "category_breakdown": category_breakdown
    }

    return report

def generate_ai_advice(report):
    """
    Send financial report to Groq and generate
    personalized financial recommendations.
    """

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise AIServiceError(
            "Groq API key is not configured.",
            503
        )

    client = Groq(api_key=api_key)

    
    prompt = f"""
You are a professional personal finance advisor specializing
in budgeting, expense management, and financial education.

Your job is to analyze the user's financial report and provide
clear, personalized, practical, and responsible financial advice.

Here is the user's financial data:

{json.dumps(report, indent=4)}

==================================================
STRICT FINANCIAL ACCURACY RULES
==================================================

1. Use ONLY the financial information provided in the report.

2. Never invent transactions, income sources, expenses,
   financial goals, habits, or personal circumstances.

3. All financial calculations are already performed by Python.
   Do not independently recalculate, modify, or contradict
   the supplied financial figures.

4. Clearly distinguish between:
   - Facts supported by the report.
   - Observations based on those facts.
   - Suggestions for the user.

5. Never assume an expense is unnecessary, excessive,
   or discretionary without supporting information.

6. Do not assume the user eats outside, shops frequently,
   has subscriptions, or follows any particular lifestyle.

7. If information is missing, acknowledge that limitation
   instead of making assumptions.

8. If no monthly budget is available, explain that budget
   analysis cannot be performed accurately.

9. Explain negative remaining budgets and high budget
   utilization correctly without exaggeration.

10. Never introduce hypothetical monetary calculations,
    savings amounts, or financial projections that are
    not supported by the report.

11. Do not invent specific monetary targets, category limits,
    or savings amounts.

12. Never recommend arbitrary amounts such as PKR 200 or
    PKR 500 unless they are explicitly provided or calculated
    using sufficient financial information.

13. Do not assume the user has a salary, paycheck,
    savings account, or automatic payment facility.

14. Describe the difference between recorded income and
    expenses as a monthly surplus, not proof of overall
    financial health.

15. Never present an estimate or assumption as a verified fact.

16. Recommendations should focus on actionable behaviors
    rather than invented financial targets.

17. When suggesting a budget, explain how the user can
    establish one using their actual spending history.

18. Avoid suggesting specific lifestyle changes unless
    the financial report provides evidence that they
    are relevant.

19. Do not assume expenses involve groceries, dining out,
    subscriptions, or recurring payments.

20. When a suggestion depends on unknown information,
    phrase it as a question or conditional recommendation.

21. Prefer recommendations that can be applied using
    the existing financial records without requiring
    assumptions about the user's lifestyle.


==================================================
RESPONSE STRUCTURE
==================================================

Use these four sections in your response:

### 1. Financial Overview

- Summarize total income, total expenses, and balance.
- Explain the user's overall financial position.
- Keep the explanation concise and understandable.

### 2. Spending Insights

- Identify the highest expense categories.
- Compare categories using their actual amounts.
- Highlight notable spending patterns visible in the data.
- Explain what can and cannot be concluded from the records.
- Never judge spending without sufficient context.

### 3. Budget Analysis

- Explain the monthly budget, if available.
- Discuss remaining budget and budget utilization.
- Identify whether spending is within or above the budget.
- Explain the financial implications clearly.
- If no budget exists, recommend setting a realistic one.

### 4. Personalized Saving Suggestions

Provide 3 to 5 actionable suggestions.

Suggestions should:
- Relate directly to the user's actual spending categories.
- Be realistic and achievable.
- Prioritize areas where improvement may be possible.
- Respect that some expenses may be essential.
- Encourage tracking expenses and planning ahead.
- Avoid arbitrary spending limits or unrealistic savings targets.

==================================================
COMMUNICATION STYLE
==================================================

- Be professional, friendly, and encouraging.
- Use simple English that anyone can understand.
- Avoid unnecessary financial jargon.
- Use PKR for all monetary amounts.
- Use bullet points where appropriate.
- Avoid repeating the same information.
- Be constructive, never judgmental.
- Do not overwhelm the user with excessive advice.

Your objective is not simply to tell the user to spend less.
Your objective is to help the user understand their financial
situation and make better financial decisions.

Generate the final advice using the four required sections.
"""


    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a responsible personal "
                        "budgeting and financial education assistant."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        advice = response.choices[0].message.content

        if not advice or not advice.strip():
            raise AIServiceError(
                "Groq returned an empty response."
            )

        return advice.strip()

    except AuthenticationError:
        raise AIServiceError(
            "Groq API authentication failed. Check your API key.",
            502
        )

    except RateLimitError:
        raise AIServiceError(
            "Groq API rate limit reached. Please try again later.",
            429
        )

    except APIConnectionError:
        raise AIServiceError(
            "Unable to connect to Groq API.",
            502
        )

    except APIStatusError:
        raise AIServiceError(
            "Groq API returned an error.",
            502
        )
