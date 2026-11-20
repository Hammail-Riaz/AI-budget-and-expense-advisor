
from flask import Blueprint, jsonify, current_app
from sqlalchemy.exc import SQLAlchemyError

from ..services.dashboard_service import get_dashboard_statistics


dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("", methods=["GET"])
def get_dashboard():

    try:
        statistics = get_dashboard_statistics()

        return jsonify({
            "success": True,
            "message": "Dashboard statistics retrieved successfully",
            "dashboard": statistics
        }), 200

    except SQLAlchemyError:
        current_app.logger.exception(
            "Database error while retrieving dashboard statistics"
        )

        return jsonify({
            "success": False,
            "message": "Database error while retrieving dashboard statistics"
        }), 500

    except Exception:
        current_app.logger.exception(
            "Unexpected error retrieving dashboard statistics"
        )

        return jsonify({
            "success": False,
            "message": "An unexpected server error occurred"
        }), 500
