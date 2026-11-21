from datetime import date
from decimal import Decimal

from sqlalchemy import func, extract

from .. import db
from ..models import Transaction


def get_spending_analytics():

    today = date.today()

    # Current month boundaries
    current_month_start = date(today.year, today.month, 1)

    if today.month == 12:
        next_month_start = date(today.year + 1, 1, 1)
    else:
        next_month_start = date(today.year, today.month + 1, 1)

    # Category-wise expenses for current month
    category_results = db.session.query(
        Transaction.category,
        func.sum(Transaction.amount).label("total")
    ).filter(
        Transaction.type == "Expense",
        Transaction.date >= current_month_start,
        Transaction.date < next_month_start
    ).group_by(
        Transaction.category
    ).all()

    category_expenses = [
        {
            "category": category,
            "total": float(total)
        }
        for category, total in category_results
    ]

    # Calculate the starting month for the last 6 months
    month_index = today.year * 12 + today.month - 1
    first_month_index = month_index - 5

    first_year = first_month_index // 12
    first_month = first_month_index % 12 + 1

    monthly_start = date(first_year, first_month, 1)

    # Retrieve monthly expense totals
    monthly_results = db.session.query(
        extract("year", Transaction.date).label("year"),
        extract("month", Transaction.date).label("month"),
        func.sum(Transaction.amount).label("total")
    ).filter(
        Transaction.type == "Expense",
        Transaction.date >= monthly_start,
        Transaction.date < next_month_start
    ).group_by(
        extract("year", Transaction.date),
        extract("month", Transaction.date)
    ).all()

    # Convert database results into a lookup dictionary
    monthly_lookup = {
        (int(year), int(month)): float(total)
        for year, month, total in monthly_results
    }

    # Include all six months, even those with zero expenses
    monthly_expenses = []

    for offset in range(6):
        index = first_month_index + offset

        year = index // 12
        month = index % 12 + 1

        monthly_expenses.append({
            "month": month,
            "year": year,
            "total": monthly_lookup.get((year, month), 0.0)
        })

    return {
        "category_expenses": category_expenses,
        "monthly_expenses": monthly_expenses
    }
