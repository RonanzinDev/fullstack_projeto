from pydantic import BaseModel

class TokenData(BaseModel):
    login: str | None = None