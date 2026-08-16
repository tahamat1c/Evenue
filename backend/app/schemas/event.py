from pydantic import BaseModel
from datetime import date as date_type, time as time_type, datetime as datetime_type
from typing import Optional

class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    date: date_type
    time: time_type
    venue: Optional[str] = None
    location: Optional[str] = None
    ticket_price: float
    available_seats: int

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    date: Optional[date_type] = None
    time: Optional[time_type] = None
    venue: Optional[str] = None
    location: Optional[str] = None
    ticket_price: Optional[float] = None
    available_seats: Optional[int] = None

class EventResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    category: Optional[str]
    date: date_type
    time: time_type
    venue: Optional[str]
    location: Optional[str]
    ticket_price: float
    available_seats: int
    image_url: Optional[str] = None
    created_at: datetime_type

    class Config:
        from_attributes = True