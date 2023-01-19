from fastapi.security import OAuth2PasswordBearer
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from services.auth_service import get_current_user
from sqlalchemy.orm import Session
from database.db import get_db
from schemas.address_schema import AddessUpdate
from repositories.addres_repository import update_addres as update

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

router = APIRouter(tags=["Address"], prefix="/api")

@router.put("/address")
def update_addres(address_update: AddessUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    update(db=db, user_id=user.id, address_update=address_update)
    return JSONResponse({"Message": "Updated"}, 200)
    