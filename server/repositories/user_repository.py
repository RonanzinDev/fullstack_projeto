from sqlalchemy.orm import Session
from models.user_model import User
from schemas.user_schema import UserCreate, UserBase
from utils.password_context import pwd_context
from sqlalchemy import delete, update, insert
from models.user_model import Address
from database.db import engine
from utils.password_context import pwd_context


def get_user(db: Session, user_id: int) -> User:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> User:
    return db.query(User).filter(User.email == email).first()

## Login porpose
def get_user_by_type(type: str, value):
    user_db = engine.execute(
        f"SELECT * FROM users WHERE {type} = '{value}'").first()
    return user_db


def create_user(db: Session, user: UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(email=user.email, name=user.name, cpf=user.cpf,
                   pis=user.pis, password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(body: UserBase, db: Session, user_id: int):
    user = get_user(db, user_id)
    if not user:
        {"Message": "User not found"}, 404

    stmt = (update(User).where(User.id == user_id).values(**body.dict()))
    db.execute(statement=stmt)
    db.commit()
    return {"Message": "Updated"}, 200


def delete_address(db: Session, user_id: int):
    stmt = (delete(Address).where(Address.user_id == user_id))
    db.execute(statement=stmt)
    db.commit()


def delete_user(user_id: int, db: Session):
    user = db.query(User).where(User.id == user_id).first()
    if not user:
        return {"Error": "User not found"}, 404
    delete_address(db, user_id)
    delete_user = (delete(User).where(User.id == user_id))
    db.execute(delete_user)
    db.commit()
    return {"Message": "User deleted"}, 200


def register_user(email, username, id, db: Session):
    stmt = (insert(User).values(email=email, name=username,
            password=pwd_context.hash(str(id))))
    db.execute(stmt)
    db.commit()
