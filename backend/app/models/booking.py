from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database.database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    number_of_tickets = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)
    booking_status = Column(String, default="confirmed")
    booking_date = Column(DateTime(timezone=True), server_default=func.now())