
from marshmallow import Schema, fields, validate, validates, ValidationError, validates_schema


# Supported transaction categories
INCOME_CATEGORIES = [
    "Pocket Money",
    "Salary",
    "Freelancing",
    "Business Income",
    "Other Income"
]

EXPENSE_CATEGORIES = [
    "Food",
    "Transport",
    "Education",
    "Shopping",
    "Entertainment",
    "Bills",
    "Healthcare",
    "Other"
]


class TransactionSchema(Schema):

    id = fields.Integer(dump_only=True)

    amount = fields.Decimal(
        required=True,
        as_string=True,
        places=2,
        validate=validate.Range(min=0.01)
    )

    category = fields.String(
        required=True,
        validate=validate.Length(min=1, max=50)
    )

    type = fields.String(
        required=True,
        validate=validate.OneOf(["Income", "Expense"])
    )

    description = fields.String(
        load_default=None,
        allow_none=True,
        validate=validate.Length(max=255)
    )

    date = fields.Date(
        required=True,
        format="%Y-%m-%d"
    )

    
    @validates_schema
    def validate_transaction_category(self, data, **kwargs):

        transaction_type = data.get("type")
        category = data.get("category")

        if transaction_type == "Income":
            allowed = INCOME_CATEGORIES

        elif transaction_type == "Expense":
            allowed = EXPENSE_CATEGORIES

        else:
            return

        if category and category not in allowed:
            raise ValidationError({
                "category": [
                    f"Invalid category for {transaction_type}."
                ]
            })



class BudgetSchema(Schema):

    id = fields.Integer(dump_only=True)

    monthly_limit = fields.Decimal(
        required=True,
        as_string=True,
        places=2,
        validate=validate.Range(min=0.01)
    )

    month = fields.Integer(
        required=True,
        validate=validate.Range(min=1, max=12)
    )

    year = fields.Integer(
        required=True,
        validate=validate.Range(min=2020, max=2100)
    )
