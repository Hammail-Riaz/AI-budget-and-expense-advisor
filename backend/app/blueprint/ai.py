from flask import Blueprint, jsonify, current_app
from sqlalchemy.exc import SQLAlchemyError

from ..services.ai_service import (
    build_financial_report,
    generate_ai_advice,
    AIServiceError
)


ai_bp = Blueprint("ai", __name__)


@ai_bp.route("/advice", methods=["POST"])
def generate_advice():

    try:
        # Step 1: Prepare financial report
        financial_report = build_financial_report()

        # Step 2: Generate AI advice
        advice = generate_ai_advice(financial_report)

        # Step 3: Return response
        return jsonify({
            "success": True,
            "message": "AI financial advice generated successfully",
            "financial_report": financial_report,
            "advice": advice
        }), 200

    except AIServiceError as error:

        current_app.logger.error(
            "AI Service Error: %s", error.message
        )

        return jsonify({
            "success": False,
            "message": error.message
        }), error.status_code

    except SQLAlchemyError:

        current_app.logger.exception(
            "Database error while preparing financial report"
        )

        return jsonify({
            "success": False,
            "message": "Database error while preparing financial report"
        }), 500

    except Exception:

        current_app.logger.exception(
            "Unexpected error while generating AI advice"
        )

        return jsonify({
            "success": False,
            "message": "An unexpected server error occurred"
        }), 500
