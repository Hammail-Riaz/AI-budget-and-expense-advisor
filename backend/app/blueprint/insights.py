from flask import Blueprint, jsonify, current_app
from sqlalchemy.exc import SQLAlchemyError

from ..services.ai_service import (
    build_financial_report,
    generate_ai_advice,
    AIServiceError,
)

insights_bp = Blueprint("insights", __name__)


@insights_bp.route("", methods=["GET"])
def get_ai_insights():
    try:
        report = build_financial_report()
        advice = generate_ai_advice(report)

        return jsonify({
            "success": True,
            "message": "AI insights generated successfully",
            "report": report,
            "advice": advice,
        }), 200

    except AIServiceError as err:
        return jsonify({
            "success": False,
            "message": err.message,
        }), err.status_code

    except SQLAlchemyError:
        current_app.logger.exception("Database error while building financial report")
        return jsonify({
            "success": False,
            "message": "Database error while building financial report",
        }), 500

    except Exception:
        current_app.logger.exception("Unexpected error generating AI insights")
        return jsonify({
            "success": False,
            "message": "An unexpected server error occurred",
        }), 500