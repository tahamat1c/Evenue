from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.chatbot import ChatRequest, ChatResponse
from app.services.chatbot_service import process_chat
from app.core.dependencies import get_optional_user

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

@router.post("/", response_model=ChatResponse)
def chat(request: ChatRequest, db: Session = Depends(get_db), current_user=Depends(get_optional_user)):
    user_id = current_user.id if current_user else None
    return process_chat(db, user_id, request.message)