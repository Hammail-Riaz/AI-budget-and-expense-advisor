
from . import db


class Transaction(db.Model):
    __tablename__ = "transactions"

    id = db.Column(db.Integer, primary_key=True)

    amount = db.Column(db.Numeric(12, 2), nullable=False)

    category = db.Column(db.String(50), nullable=False)

    type = db.Column(db.String(10), nullable=False)

    description = db.Column(db.String(255), nullable=True)

    date = db.Column(db.Date, nullable=False)

    # Database constraints
    __table_args__ = (
        db.CheckConstraint(
            "amount > 0",
            name="check_transaction_amount"
        ),
        db.CheckConstraint(
            "type IN ('Income', 'Expense')",
            name="check_transaction_type"
        ),
    )

    def __repr__(self):
        return f"<Transaction {self.id} - {self.type} - {self.amount}>"


class Budget(db.Model):
    __tablename__ = "budgets"

    id = db.Column(db.Integer, primary_key=True)

    monthly_limit = db.Column(db.Numeric(12, 2), nullable=False)

    month = db.Column(db.Integer, nullable=False)

    year = db.Column(db.Integer, nullable=False)

    # Database constraints
    __table_args__ = (
        db.UniqueConstraint(
            "month",
            "year",
            name="unique_month_year"
        ),
        db.CheckConstraint(
            "monthly_limit > 0",
            name="check_monthly_limit"
        ),
        db.CheckConstraint(
            "month BETWEEN 1 AND 12",
            name="check_budget_month"
        ),
    )

    def __repr__(self):
        return f"<Budget {self.month}/{self.year} - {self.monthly_limit}>"
