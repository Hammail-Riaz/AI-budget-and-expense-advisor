
from .transactions import transactions_bp
from .dashboard import dashboard_bp
from .budget import budget_bp
from .analytics import analytics_bp


def register_blueprints(app):

    app.register_blueprint(
        transactions_bp,
        url_prefix="/api/transactions"
    )

    app.register_blueprint(
        dashboard_bp,
        url_prefix="/api/dashboard"
    )
    
    app.register_blueprint(
        budget_bp,
        url_prefix="/api/budget"
    )
    
    app.register_blueprint(
    analytics_bp,
    url_prefix="/api/analytics"
    )
