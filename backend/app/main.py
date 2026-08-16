from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database.database import Base, engine
from app.models import user, event, booking
from app.api import auth, events, bookings, chatbot

app = FastAPI(title="Event Booking Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router)
app.include_router(events.router)
app.include_router(bookings.router)
app.include_router(chatbot.router)

@app.get("/")
def root():
    return {"message": "Event Booking API is running"}