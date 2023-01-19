from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.db import engine
from models.user_model import Base
from controllers.auth_controller import router as auth_router
from controllers.user_controller import router as user_router
from controllers.address_controller import router as address_router

Base.metadata.create_all(bind=engine)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(address_router)
app.include_router(user_router)

@app.get("/", tags=["Home"])
def index():
    return {"Message": "Go to /docs"}
