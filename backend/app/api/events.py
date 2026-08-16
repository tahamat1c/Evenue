import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.database import get_db
from app.schemas.event import EventCreate, EventUpdate, EventResponse
from app.services import event_service
from app.core.dependencies import get_current_admin

router = APIRouter(prefix="/events", tags=["Events"])

UPLOAD_DIR = "uploads/events"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

@router.get("/", response_model=List[EventResponse])
def list_events(category: Optional[str] = None, location: Optional[str] = None, db: Session = Depends(get_db)):
    return event_service.get_all_events(db, category, location)

@router.get("/{event_id}", response_model=EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    return event_service.get_event_by_id(db, event_id)

@router.post("/", response_model=EventResponse)
def create_event(event_data: EventCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return event_service.create_event(db, event_data)

@router.put("/{event_id}", response_model=EventResponse)
def update_event(event_id: int, event_data: EventUpdate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return event_service.update_event(db, event_id, event_data)

@router.delete("/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return event_service.delete_event(db, event_id)

@router.post("/{event_id}/upload-image", response_model=EventResponse)
def upload_event_image(event_id: int, file: UploadFile = File(...), db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only .jpg, .jpeg, .png, .webp files allowed")

    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large, max 5MB")

    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    with open(filepath, "wb") as buffer:
        buffer.write(file.file.read())

    image_url = f"/uploads/events/{filename}"
    return event_service.update_event_image(db, event_id, image_url)