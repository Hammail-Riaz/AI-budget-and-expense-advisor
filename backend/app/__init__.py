
import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv


# Load environment variables
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()


def create_app():

    app = Flask(__name__, instance_relative_config=True)

    # Create instance directory if it doesn't exist
    os.makedirs(app.instance_path, exist_ok=True)

    # Application configuration
    app.config["SECRET_KEY"] = os.getenv(
        "SECRET_KEY", "dev-secret-key"
    )

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL", "sqlite:///budget.db"
    )

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialize extensions with Flask app
    db.init_app(app)
    migrate.init_app(app, db)

    # Configure CORS for React frontend
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": ["http://localhost:5173"]
            }
        }
    )

    # Basic health-check endpoint
    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "success": True,
            "message": "AI Budget Advisor API is running"
        }), 200

    # Blueprints will be registered here later

    return app
