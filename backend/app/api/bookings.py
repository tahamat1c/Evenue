from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.schemas.booking import BookingCreate, BookingResponse, AdminBookingResponse
from app.services import booking_service
from app.core.dependencies import get_current_user, get_current_admin

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post("/", response_model=BookingResponse)
def book_event(booking_data: BookingCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return booking_service.create_booking(db, current_user.id, booking_data)

@router.get("/", response_model=List[BookingResponse])
def my_bookings(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return booking_service.get_user_bookings(db, current_user.id)

@router.get("/all", response_model=List[AdminBookingResponse])
def all_bookings(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return booking_service.get_all_bookings_detailed(db)

@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return booking_service.get_booking_by_id(db, booking_id, current_user.id)

@router.delete("/{booking_id}", response_model=BookingResponse)
def cancel_booking(booking_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return booking_service.cancel_booking(db, booking_id, current_user.id)