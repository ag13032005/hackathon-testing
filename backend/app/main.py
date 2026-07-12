from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.core.database import Base, engine, SessionLocal
from backend.app.models import models
from backend.app.core.security import get_password_hash
from backend.app.api.endpoints import router as api_router

# Automatically create all SQL tables (SQLite/Postgres)
Base.metadata.create_all(bind=engine)

# Seed the required Tech Head developer account if missing
def seed_tech_head_user():
    db = SessionLocal()
    try:
        admin_email = "echoplayzop@gmail.com"
        admin = db.query(models.User).filter(models.User.email == admin_email).first()
        if not admin:
            hashed_pwd = get_password_hash("8520147963")
            new_admin = models.User(
                email=admin_email,
                password_hash=hashed_pwd,
                full_name="Super Admin (Tech Head)",
                phone="9852014763",
                role="TECH_HEAD"
            )
            db.add(new_admin)
            db.commit()
            print("Successfully seeded Tech Head developer account: echoplayzop@gmail.com")
    finally:
        db.close()

seed_tech_head_user()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Enable CORS for Next.js frontend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": "EWIT Hackathon Management API Server is running!"}
