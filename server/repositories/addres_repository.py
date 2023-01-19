from sqlalchemy.orm import Session
from schemas.address_schema import AddessCreate, AddessUpdate
from models.user_model import Address
from sqlalchemy import update, insert

def create_user_addres(db: Session, address: AddessCreate, user_id: int):
    try:
        stmt = (insert(Address).values(**address.dict(), user_id=user_id))
        db.execute(stmt)
        db.commit()
    except Exception as e:
        raise e
    
def get_address(db: Session,user_id: int):
    return db.query(Address).where(Address.user_id == user_id).first()
    
 
def update_addres(db: Session, user_id: int, address_update: AddessUpdate):
    addres = get_address(db, user_id)
    if not addres:
        create_user_addres(db,address_update, user_id)
    else:     
        stmt = (update(Address).where(Address.user_id == user_id).values(**address_update.dict()))
        db.execute(statement=stmt)
        db.commit()
    
    
