from .. import db
from ..models import Transaction


def create_transaction(data):
    """
    Create and save a transaction in the database.
    """

    transaction = Transaction(
        amount=data["amount"],
        category=data["category"],
        type=data["type"],
        description=data.get("description"),
        date=data["date"]
    )

    try:
        db.session.add(transaction)
        db.session.commit()

        return transaction

    except Exception:
        db.session.rollback()
        raise
    
    
# for the GET/api/transactions endpoint 
def get_all_transactions():

    transactions = Transaction.query.order_by(
        Transaction.date.desc(),
        Transaction.id.desc()
    ).all()

    return transactions


# for the DELETE/api/transactions/<int:transaction_id> endpoint
def delete_transaction(transaction_id):

    # Find transaction by ID
    transaction = db.session.get(Transaction, transaction_id)

    # Check whether transaction exists
    if transaction is None:
        return False

    try:
        # Delete transaction
        db.session.delete(transaction)
        db.session.commit()

        return True

    except Exception:
        db.session.rollback()
        raise
