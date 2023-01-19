from fastapi import APIRouter, Depends, Response
from services.auth_service import get_current_user
from repositories.user_repository import get_user, update_user, delete_user as delete
from repositories.addres_repository import get_address
from sqlalchemy.orm import Session
from database.db import get_db
from schemas.user_schema import UserBase
from fastapi.responses import JSONResponse
router = APIRouter(tags=["User"], prefix="/api/user")


@router.get("/")
def get(logged_user=Depends(get_current_user), db: Session = Depends(get_db)):
    user = get_user(db, logged_user.id)
    address = get_address(db, user.id)
    if user is None:
        return JSONResponse({"Error": "User not found"}, 400)
    return {"user": user, "address": address}

@router.put("/")
def update(body: UserBase, db: Session = Depends(get_db), logged_user=Depends(get_current_user)):
    message, status = update_user(body, db, logged_user.id)
    return JSONResponse(message, status_code=status)


@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    status, message = delete(user_id=user_id, db=db)
    return JSONResponse(status, message)
