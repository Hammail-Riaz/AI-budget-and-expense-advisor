
from .. import db
from ..models import Budget

from datetime import date

def save_budget(data):

    # Find an existing budget for this month and year
    budget = Budget.query.filter_by(
        month=data["month"],
        year=data["year"]
    ).first()

    try:
        if budget:
            # Update existing budget
            budget.monthly_limit = data["monthly_limit"]

        else:
            # Create a new budget
            budget = Budget(
                monthly_limit=data["monthly_limit"],
                month=data["month"],
                year=data["year"]
            )

            db.session.add(budget)

        db.session.commit()

        return budget

    except Exception:
        db.session.rollback()
        raise





def get_budget(month=None, year=None):

    # Use the current month and year if not provided
    today = date.today()

    if month is None:
        month = today.month

    if year is None:
        year = today.year

    # Find the budget for the requested month and year
    budget = Budget.query.filter_by(
        month=month,
        year=year
    ).first()

    return budget
