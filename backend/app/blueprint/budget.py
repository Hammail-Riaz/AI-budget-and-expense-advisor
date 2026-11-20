
from flask import Blueprint, request, jsonify, current_app
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from ..schemas import BudgetSchema
from ..services.budget_service import save_budget, get_budget


budget_bp = Blueprint("budget", __name__)

budget_schema = BudgetSchema()


@budget_bp.route("", methods=["POST"])
def create_or_update_budget():

    if not request.is_json:
        return jsonify({
            "success": False,
            "message": "Request must contain JSON data"
        }), 400

    payload = request.get_json()

    try:
        validated_data = budget_schema.load(payload)

        budget = save_budget(validated_data)

        return jsonify({
            "success": True,
            "message": "Budget saved successfully",
            "budget": budget_schema.dump(budget)
        }), 200

    except ValidationError as error:
        return jsonify({
            "success": False,
            "message": "Validation failed",
            "errors": error.messages
        }), 400

    except SQLAlchemyError:
        current_app.logger.exception(
            "Database error while saving budget"
        )

        return jsonify({
            "success": False,
            "message": "Database error while saving budget"
        }), 500

    except Exception:
        current_app.logger.exception(
            "Unexpected error saving budget"
        )

        return jsonify({
            "success": False,
            "message": "An unexpected server error occurred"
        }), 500



@budget_bp.route("", methods=["GET"])
def retrieve_budget():

    try:
        # Get month and year from query parameters
        month_param = request.args.get("month")
        year_param = request.args.get("year")

        # Convert parameters to integers
        month = int(month_param) if month_param else None
        year = int(year_param) if year_param else None

        # Validate month and year
        if month is not None and not 1 <= month <= 12:
            return jsonify({
                "success": False,
                "message": "Month must be between 1 and 12"
            }), 400

        if year is not None and not 2020 <= year <= 2100:
            return jsonify({
                "success": False,
                "message": "Year must be between 2020 and 2100"
            }), 400

        # Retrieve budget from service
        budget = get_budget(month, year)

        if budget is None:
            return jsonify({
                "success": False,
                "message": "Budget not found"
            }), 404

        return jsonify({
            "success": True,
            "message": "Budget retrieved successfully",
            "budget": budget_schema.dump(budget)
        }), 200

    except ValueError:
        return jsonify({
            "success": False,
            "message": "Month and year must be valid integers"
        }), 400

    except SQLAlchemyError:
        current_app.logger.exception(
            "Database error while retrieving budget"
        )

        return jsonify({
            "success": False,
            "message": "Database error while retrieving budget"
        }), 500

    except Exception:
        current_app.logger.exception(
            "Unexpected error retrieving budget"
        )

        return jsonify({
            "success": False,
            "message": "An unexpected server error occurred"
        }), 500
