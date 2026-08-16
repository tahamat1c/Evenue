from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.booking import Booking
from app.models.event import Event
from app.schemas.booking import BookingCreate

def create_booking(db: Session, user_id: int, booking_data: BookingCreate):
    event = db.query(Event).filter(Event.id == booking_data.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if event.available_seats < booking_data.number_of_tickets:
        raise HTTPException(status_code=400, detail="Not enough seats available")

    total_price = event.ticket_price * booking_data.number_of_tickets

    new_booking = Booking(
        user_id=user_id,
        event_id=booking_data.event_id,
        number_of_tickets=booking_data.number_of_tickets,
        total_price=total_price,
        booking_status="confirmed"
    )

    event.available_seats -= booking_data.number_of_tickets

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking

def get_user_bookings(db: Session, user_id: int):
    return db.query(Booking).filter(Booking.user_id == user_id).all()

def get_booking_by_id(db: Session, booking_id: int, user_id: int):
    booking = db.query(Booking).filter(Booking.id == booking_id, Booking.user_id == user_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

def cancel_booking(db: Session, booking_id: int, user_id: int):
    booking = get_booking_by_id(db, booking_id, user_id)
    if booking.booking_status == "cancelled":
        raise HTTPException(status_code=400, detail="Booking already cancelled")

    event = db.query(Event).filter(Event.id == booking.event_id).first()
    if event:
        event.available_seats += booking.number_of_tickets

    booking.booking_status = "cancelled"
    db.commit()
    db.refresh(booking)
    return booking

def get_all_bookings_detailed(db: Session):
    from app.models.user import User
    from app.models.event import Event

    bookings = db.query(Booking).all()
    result = []
    for b in bookings:
        user = db.query(User).filter(User.id == b.user_id).first()
        event = db.query(Event).filter(Event.id == b.event_id).first()
        result.append({
            "id": b.id,
            "user_id": b.user_id,
            "user_name": user.name if user else "Unknown",
            "user_email": user.email if user else "Unknown",
            "event_id": b.event_id,
            "event_title": event.title if event else "Unknown",
            "number_of_tickets": b.number_of_tickets,
            "total_price": b.total_price,
            "booking_status": b.booking_status,
            "booking_date": b.booking_date
        })
    return result