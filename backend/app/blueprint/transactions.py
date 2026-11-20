from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from ..schemas import TransactionSchema
from ..services.transaction_service import (
    create_transaction,
    get_all_transactions,
    delete_transaction
)
from flask import Blueprint, request, jsonify, current_app


transactions_bp = Blueprint(
    "transactions",
    __name__
)

transaction_schema = TransactionSchema()


@transactions_bp.route("", methods=["POST"])
def add_transaction():

    # 1. Check whether the request contains JSON
    if not request.is_json:
        return jsonify({
            "success": False,
            "message": "Request must contain JSON data"
        }), 400

    # 2. Read JSON data
    payload = request.get_json()

    try:
        # 3. Validate incoming data
        validated_data = transaction_schema.load(payload)

        # 4. Save transaction through service layer
        transaction = create_transaction(validated_data)

        # 5. Return successful response
        return jsonify({
            "success": True,
            "message": "Transaction added successfully",
            "transaction": transaction_schema.dump(transaction)
        }), 201

    except ValidationError as error:
        return jsonify({
            "success": False,
            "message": "Validation failed",
            "errors": error.messages
        }), 400

    except SQLAlchemyError:
        return jsonify({
            "success": False,
            "message": "Database error while saving transaction"
        }), 500
        
    except Exception:
        current_app.logger.exception("Unexpected error adding transaction")

    return jsonify({
        "success": False,
        "message": "An unexpected server error occurred"
    }), 500
    
    
    

@transactions_bp.route("", methods=["GET"])
def get_transactions():

    try:
        transactions = get_all_transactions()

        return jsonify({
            "success": True,
            "message": "Transactions retrieved successfully",
            "transactions": transaction_schema.dump(transactions, many=True)
        }), 200

    except SQLAlchemyError:
        current_app.logger.exception(
            "Database error while retrieving transactions"
        )

        return jsonify({
            "success": False,
            "message": "Database error while retrieving transactions"
        }), 500

    except Exception:
        current_app.logger.exception(
            "Unexpected error retrieving transactions"
        )

        return jsonify({
            "success": False,
            "message": "An unexpected server error occurred"
        }), 500



# for deteleting a transaction by ID
@transactions_bp.route("/<int:transaction_id>", methods=["DELETE"])
def remove_transaction(transaction_id):

    try:
        deleted = delete_transaction(transaction_id)

        if not deleted:
            return jsonify({
                "success": False,
                "message": "Transaction not found"
            }), 404

        return jsonify({
            "success": True,
            "message": "Transaction deleted successfully",
            "transaction_id": transaction_id
        }), 200

    except SQLAlchemyError:
        current_app.logger.exception(
            "Database error while deleting transaction"
        )

        return jsonify({
            "success": False,
            "message": "Database error while deleting transaction"
        }), 500

    except Exception:
        current_app.logger.exception(
            "Unexpected error deleting transaction"
        )

        return jsonify({
            "success": False,
            "message": "An unexpected server error occurred"
        }), 500
