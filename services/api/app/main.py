from fastapi import FastAPI

from app.api.v1.astrology import router as astrology_router
from app.api.v1.auth import router as auth_router
from app.api.v1.duong_dao import router as duong_dao_router
from app.api.v1.health import router as health_router
from app.api.v1.iching import router as iching_router
from app.api.v1.journal import router as journal_router
from app.api.v1.payments import router as payments_router
from app.api.v1.sessions import router as sessions_router
from app.api.v1.tarot import router as tarot_router
from app.config import get_settings
from app.core.errors import register_error_handlers


def create_app() -> FastAPI:
    """Application factory initializing and configuring FastAPI instance."""
    settings = get_settings()

    app = FastAPI(
        title=settings.APP_NAME,
        version="0.1.0",
        description="HUYỀN TÂM MINH ĐẠO Backend API Service Foundation",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
    )

    # Register error handlers
    register_error_handlers(app)

    # Include routers
    app.include_router(health_router)
    app.include_router(auth_router)
    app.include_router(payments_router)
    app.include_router(sessions_router)
    app.include_router(tarot_router)
    app.include_router(iching_router)
    app.include_router(astrology_router)
    app.include_router(duong_dao_router)
    app.include_router(journal_router)

    return app


app = create_app()
