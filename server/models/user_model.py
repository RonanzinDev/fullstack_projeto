from sqlalchemy import String, Integer, Column, ForeignKey
from sqlalchemy.orm import relationship

from database.db import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(60), unique=True, index=True, nullable=False)
    name = Column(String(50), nullable=False)
    cpf = Column(String(60),unique=True)
    pis = Column(String(60), unique=True)
    password = Column(String(100))
    address = relationship("Address", back_populates="user",cascade="all, delete", passive_deletes=True)
    
    
class Address(Base):
    __tablename__ = "address"
    
    id = Column(Integer, primary_key=True, index=True)
    pais = Column(String(60))
    estado = Column(String(60))
    municipio = Column(String(60))
    cep = Column(String(60))
    rua = Column(String(60))
    numero = Column(Integer)
    complemento = Column(String(60))
    user_id = Column(Integer, ForeignKey("users.id", ondelete='CASCADE'), unique=True)

    user = relationship("User", back_populates="address")
