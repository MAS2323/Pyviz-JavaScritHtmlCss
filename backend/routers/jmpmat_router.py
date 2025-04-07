from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from controllers.jmpmat_controller import (
    create_jmpmat,
    get_jmpmat_by_id,
    update_jmpmat,
    delete_jmpmat,
    get_all_jmpmat,
)
from schemas.jmpmat_schemas import JmpMatSchema
from database import get_db

jmpmat_router = APIRouter(prefix="/jmpmat", tags=["JMPMAT"])

# Ruta para crear un registro en jmpmat
@jmpmat_router.post("/")
def create_jmpmat_route(jmpmat_data: JmpMatSchema, db: Session = Depends(get_db)):
    return create_jmpmat(db, jmpmat_data)

# Ruta para obtener un registro de jmpmat por gId
@jmpmat_router.get("/{gId}")
def read_jmpmat(gId: int, db: Session = Depends(get_db)):
    return get_jmpmat_by_id(db, gId)

# Ruta para actualizar un registro en jmpmat
@jmpmat_router.put("/{gId}")
def update_jmpmat_route(gId: int, updated_jmpmat: JmpMatSchema, db: Session = Depends(get_db)):
    return update_jmpmat(db, gId, updated_jmpmat)

# Ruta para eliminar un registro de jmpmat
@jmpmat_router.delete("/{gId}")
def delete_jmpmat_route(gId: int, db: Session = Depends(get_db)):
    return delete_jmpmat(db, gId)

@jmpmat_router.get("/", response_model=list[JmpMatSchema])
def read_all_jmpmat(db: Session = Depends(get_db)):
    return get_all_jmpmat(db)