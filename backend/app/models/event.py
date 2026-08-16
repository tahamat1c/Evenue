from sqlalchemy import Column, Integer, String, Float, DateTime, Date, Time
from sqlalchemy.sql import func
from app.database.database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    category = Column(String)
    date = Column(Date, nullable=False)
    time = Column(Time, nullable=False)
    venue = Column(String)
    location = Column(String)
    ticket_price = Column(Float, nullable=False)
    available_seats = Column(Integer, nullable=False)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())