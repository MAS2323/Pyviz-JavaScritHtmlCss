from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.jmpmat_models import JmpMat
from schemas.jmpmat_schemas import JmpMatSchema

# Crear un registro en jmpmat
def create_jmpmat(db: Session, jmpmat_data: JmpMatSchema):
    db_jmpmat = JmpMat(**jmpmat_data.dict())
    db.add(db_jmpmat)
    db.commit()
    db.refresh(db_jmpmat)
    return db_jmpmat

# Obtener un registro de jmpmat por gId
def get_jmpmat_by_id(db: Session, gId: int):
    db_jmpmat = db.query(JmpMat).filter(JmpMat.gId == gId).first()
    if not db_jmpmat:
        raise HTTPException(status_code=404, detail="JMPMAT not found")
    return db_jmpmat

# Actualizar un registro en jmpmat
def update_jmpmat(db: Session, gId: int, updated_jmpmat: JmpMatSchema):
    db_jmpmat = db.query(JmpMat).filter(JmpMat.gId == gId).first()
    if not db_jmpmat:
        raise HTTPException(status_code=404, detail="JMPMAT not found")
    for key, value in updated_jmpmat.dict().items():
        setattr(db_jmpmat, key, value)
    db.commit()
    db.refresh(db_jmpmat)
    return db_jmpmat

# Eliminar un registro de jmpmat
def delete_jmpmat(db: Session, gId: int):
    db_jmpmat = db.query(JmpMat).filter(JmpMat.gId == gId).first()
    if not db_jmpmat:
        raise HTTPException(status_code=404, detail="JMPMAT not found")
    db.delete(db_jmpmat)
    db.commit()
    return {"message": "JMPMAT deleted successfully"}