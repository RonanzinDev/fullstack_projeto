from pydantic import BaseModel
from schemas.address_schema import Address, AddessCreate

class UserBase(BaseModel):
    email: str
    name: str
    cpf: str
    pis: str


class UserCreate(UserBase):
    address: AddessCreate
    password: str


class User(UserBase):
    id: int
    address: list[Address] = []

    class Config:
        orm_mode = True


class UserLogin(BaseModel):
    login: str
    password: str
    type: int


