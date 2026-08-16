from sqlalchemy.orm import Session
from app.ai.llm import chat_with_bot

def process_chat(db: Session, user_id: int, message: str):
    reply = chat_with_bot(db, user_id, message)
    return {"reply": reply}