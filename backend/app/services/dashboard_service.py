
from datetime import date
from decimal import Decimal

from .. import db
from ..models import Transaction, Budget


def get_dashboard_statistics():

    # Get current month and year
    today = date.today()
    current_month = today.month
    current_year = today.year

    # Define current month's date range
    start_date = date(current_year, current_month, 1)

    if current_month == 12:
        next_month = date(current_year + 1, 1, 1)
    else:
        next_month = date(current_year, current_month + 1, 1)

    # Calculate total income
    total_income = db.session.query(
        db.func.coalesce(db.func.sum(Transaction.amount), 0)
    ).filter(
        Transaction.type == "Income",
        Transaction.date >= start_date,
        Transaction.date < next_month
    ).scalar()

    # Calculate total expenses
    total_expenses = db.session.query(
        db.func.coalesce(db.func.sum(Transaction.amount), 0)
    ).filter(
        Transaction.type == "Expense",
        Transaction.date >= start_date,
        Transaction.date < next_month
    ).scalar()

    # Convert results to Decimal
    total_income = Decimal(str(total_income))
    total_expenses = Decimal(str(total_expenses))

    # Calculate balance
    balance = total_income - total_expenses

    # Retrieve current month's budget
    budget = Budget.query.filter_by(
        month=current_month,
        year=current_year
    ).first()

    if budget:
        monthly_budget = Decimal(str(budget.monthly_limit))
        remaining_budget = monthly_budget - total_expenses
    else:
        monthly_budget = None
        remaining_budget = None

    # Return dashboard statistics
    return {
        "period": {
            "month": current_month,
            "year": current_year
        },
        "total_income": f"{total_income:.2f}",
        "total_expenses": f"{total_expenses:.2f}",
        "balance": f"{balance:.2f}",
        "monthly_budget": (
            f"{monthly_budget:.2f}"
            if monthly_budget is not None else None
        ),
        "remaining_budget": (
            f"{remaining_budget:.2f}"
            if remaining_budget is not None else None
        )
    }
