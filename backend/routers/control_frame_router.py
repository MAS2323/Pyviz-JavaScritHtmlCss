from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from schemas.control_frame_schema import ControlFrameCreate, ControlFrameResponse
from controllers.control_frame_controller import create_control_frame, receive_control_frame, get_control_frames, ValuesHandler
from database import get_db

control_frame_router = APIRouter(prefix="/control-frames", tags=["Control Frames"])

@control_frame_router.post("/send_control_frame", response_model=ControlFrameResponse)
def send_control_frame(frame_data: ControlFrameCreate, db: Session = Depends(get_db)):
    return create_control_frame(db, frame_data.dict())

@control_frame_router.post("/receive_control_frame", response_model=ControlFrameResponse)
def receive_control_frame(data: bytes, db: Session = Depends(get_db)):
    return receive_control_frame(db, data)

@control_frame_router.get("/control_frames", response_model=List[ControlFrameResponse])
def get_all_control_frames(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_control_frames(db, skip, limit)

@control_frame_router.get("/control_frames/{frame_id}/values", response_model=Dict[str, Any])
def get_control_frame_values(frame_id: int, db: Session = Depends(get_db)):
    frame = db.query(ControlFrame).filter(ControlFrame.id == frame_id).first()
    if not frame:
        raise HTTPException(status_code=404, detail="Control frame not found")
    try:
        values = ValuesHandler.deserialize(frame.cmdFlg, frame.values)
        return {
            "cmdFlg": frame.cmdFlg,
            "gId": frame.gId,
            "param": frame.param,
            "values": values
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))