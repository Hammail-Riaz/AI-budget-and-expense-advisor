
from flask import Blueprint, jsonify, current_app
from sqlalchemy.exc import SQLAlchemyError

from ..services.analytics_service import get_spending_analytics


analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.route("", methods=["GET"])
def retrieve_analytics():

    try:
        analytics = get_spending_analytics()

        return jsonify({
            "success": True,
            "message": "Analytics retrieved successfully",
            "analytics": analytics
        }), 200

    except SQLAlchemyError:
        current_app.logger.exception(
            "Database error while retrieving analytics"
        )

        return jsonify({
            "success": False,
            "message": "Database error while retrieving analytics"
        }), 500

    except Exception:
        current_app.logger.exception(
            "Unexpected error retrieving analytics"
        )

        return jsonify({
            "success": False,
            "message": "An unexpected server error occurred"
        }), 500
