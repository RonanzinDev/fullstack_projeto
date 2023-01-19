from pydantic import BaseModel
from models.user_model import Address

class AddressBase(BaseModel):
    pais: str | None
    estado: str | None
    municipio :  str | None
    cep : str | None
    rua : str | None
    numero: int | None
    complemento : str | None


class AddessCreate(AddressBase):
    pass


class Address(AddressBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True
        arbitrary_types_allowed = True
        column_default_sort = [(Address.id, True)]


class AddessUpdate(AddressBase):
    pass