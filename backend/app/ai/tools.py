from sqlalchemy.orm import Session
from app.models.event import Event
from app.models.booking import Booking

def search_events(db: Session, category: str = None, location: str = None):
    query = db.query(Event)
    if category:
        query = query.filter(Event.category.ilike(f"%{category}%"))
    if location:
        query = query.filter(Event.location.ilike(f"%{location}%"))
    events = query.all()

    if not events:
        return "No events found matching that criteria."

    result = []
    for e in events:
        result.append({
            "id": e.id,
            "title": e.title,
            "category": e.category,
            "date": str(e.date),
            "time": str(e.time),
            "venue": e.venue,
            "location": e.location,
            "ticket_price": e.ticket_price,
            "available_seats": e.available_seats
        })
    return result

def get_event_details(db: Session, event_id: int):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        return "Event not found."
    return {
        "id": event.id,
        "title": event.title,
        "description": event.description,
        "category": event.category,
        "date": str(event.date),
        "time": str(event.time),
        "venue": event.venue,
        "location": event.location,
        "ticket_price": event.ticket_price,
        "available_seats": event.available_seats
    }

def get_my_bookings(db: Session, user_id: int):
    if user_id is None:
        return "You need to be logged in to view your bookings."
    bookings = db.query(Booking).filter(Booking.user_id == user_id).all()
    if not bookings:
        return "You have no bookings yet."

    result = []
    for b in bookings:
        event = db.query(Event).filter(Event.id == b.event_id).first()
        result.append({
            "booking_id": b.id,
            "event_title": event.title if event else "Unknown",
            "number_of_tickets": b.number_of_tickets,
            "total_price": b.total_price,
            "status": b.booking_status,
            "booking_date": str(b.booking_date)
        })
    return result