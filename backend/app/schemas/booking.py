from pydantic import BaseModel
from datetime import datetime as datetime_type
from typing import Optional

class BookingCreate(BaseModel):
    event_id: int
    number_of_tickets: int

class BookingResponse(BaseModel):
    id: int
    user_id: int
    event_id: int
    number_of_tickets: int
    total_price: float
    booking_status: str
    booking_date: datetime_type

    class Config:
        from_attributes = True

class AdminBookingResponse(BaseModel):
    id: int
    user_id: int
    user_name: str
    user_email: str
    event_id: int
    event_title: str
    number_of_tickets: int
    total_price: float
    booking_status: str
    booking_date: datetime_type

    class Config:
        from_attributes = True