from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.event import Event
from app.schemas.event import EventCreate, EventUpdate

def create_event(db: Session, event_data: EventCreate):
    new_event = Event(**event_data.model_dump())
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

def get_all_events(db: Session, category: str = None, location: str = None):
    query = db.query(Event)
    if category:
        query = query.filter(Event.category == category)
    if location:
        query = query.filter(Event.location == location)
    return query.all()

def get_event_by_id(db: Session, event_id: int):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

def update_event(db: Session, event_id: int, event_data: EventUpdate):
    event = get_event_by_id(db, event_id)
    update_data = event_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(event, key, value)
    db.commit()
    db.refresh(event)
    return event

def delete_event(db: Session, event_id: int):
    event = get_event_by_id(db, event_id)
    db.delete(event)
    db.commit()
    return {"message": "Event deleted successfully"}

def update_event_image(db: Session, event_id: int, image_url: str):
    event = get_event_by_id(db, event_id)
    event.image_url = image_url
    db.commit()
    db.refresh(event)
    return event