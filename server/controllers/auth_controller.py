from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from schemas.user_schema import UserLogin, UserCreate
from sqlalchemy.orm import Session
from database.db import get_db
from services.auth_service import user_login, github_oauth_login
from repositories.user_repository import create_user, get_user_by_email
from repositories.addres_repository import create_user_addres
from schemas.user_schema import UserLogin
from fastapi.responses import RedirectResponse
from services.github_service import get_access_code, get_user_email, get_user_id

router = APIRouter(tags=["Auth"], prefix="/api", responses={403: {"description": "Forbidden"}})

@router.post("/login")
def login_token(user: UserLogin):
    return user_login(user)

@router.post("/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    else:
        user_a = create_user(db=db, user=user)
        create_user_addres(db=db, address=user.address, user_id=user_a.id)
        return JSONResponse({"Message": "User created"}, 200)
                   
@router.get("/login/github-code")
async def github_code(code: str, db: Session = Depends(get_db)):
    headers = {'Accept': 'application/json'}
    access_token = await get_access_code(code, headers)
    email = await get_user_email(access_token, headers)
    id, username = await get_user_id(headers)
    token = github_oauth_login(email, username, id, db)
    response = RedirectResponse('http://localhost:3000/home')
    response.set_cookie("token",token["access_token"])
    return response
