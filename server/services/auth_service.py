from datetime import datetime, timedelta
from jose import jwt, JWTError
from configs.config import SECRET_KEY, ALGORITHM
from sqlalchemy.orm import Session
from schemas.user_schema import UserLogin
from repositories.user_repository import get_user_by_type, register_user
from utils.password_context import pwd_context
from configs.config import ACCESS_TOKEN_EXPIRE_MINUTES
from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException, Depends, status
from fastapi.responses import JSONResponse
from database.db import get_db
from models.token_model import TokenData
from database.db import engine
from repositories.user_repository import get_user_by_email
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub: str = payload.get("sub")
        data = sub.split(";")
        if data is None:
            raise credentials_exception
        token_data = TokenData(login=data[1])
    except JWTError:
        raise credentials_exception
    user = get_user_by_type(data[0], token_data.login)
    if user is None:
        raise credentials_exception
    return user


def validate_type(type: int):
    t = ""
    match type:
        case 1:
            t = "email"
        case 2:
            t = "cpf"
        case 3:
            t = "pis"
    return t


def user_login(user: UserLogin):
    login_type = validate_type(user.type)
    user_db = engine.execute(
        f"SELECT {login_type}, password FROM users WHERE {login_type} = '{user.login}'").first()
    if user_db is None:
        return JSONResponse({"Error": f"{login_type} not found"}, 404)
    if pwd_context.verify(user.password, user_db["password"]):
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": f"{login_type};{user.login}"}, expires_delta=access_token_expires)
        return JSONResponse({"access_token": access_token, "token_type": "bearer"}, 200)
    else:
        return JSONResponse({"Error": "Password wrong"}, 400)


def github_oauth_login(email: str, username: str, id: int, db: Session):
    login_type = "email"
    user = get_user_by_email(db, email)
    if user:
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": f"{login_type};{email}"}, expires_delta=access_token_expires)
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        register_user(email, username, id, db)
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": f"{login_type};{email}"}, expires_delta=access_token_expires)
        return {"access_token": access_token, "token_type": "bearer"}
