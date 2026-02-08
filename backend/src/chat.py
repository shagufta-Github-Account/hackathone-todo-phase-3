import os
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import APIRouter, Request, Depends, HTTPException
from sqlmodel import Session, select

load_dotenv()

# Sahi imports (Sirf wahi jo models.py mein hain)
from src.core.database import get_session 
from src.models.models import Message, Conversation 
# Task agar tasks file mein hai to wahan se uthain
try:
    from src.api.tasks import Task
except ImportError:
    # Agar phir bhi na mile to backend crash na ho
    Task = None

router = APIRouter()

# Gemini Config
genai.configure(api_key=os.getenv("OPENAI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

@router.post("/api/{user_id}/chat")
async def chat_with_ai(user_id: str, request: Request, session: Session = Depends(get_session)):
    try:
        data = await request.json()
        user_msg = data.get("message", "")
        
        # 1. Gemini se response lena
        prompt = f"User wants help with tasks. User message: {user_msg}. Give a helpful short reply."
        response = model.generate_content(prompt)
        final_response_text = response.text

        # 2. Basic Task logic (Agar Task mil gaya ho)
        if Task and "add" in user_msg.lower():
            new_task = Task(user_id=user_id, title=user_msg.replace("add", "").strip(), is_completed=False)
            session.add(new_task)
            session.commit()
            final_response_text = f"✅ Added to your list! {final_response_text}"

        return {"response": final_response_text}

    except Exception as e:
        print(f"Error: {e}")
        return {"response": "I'm having trouble connecting to Gemini. Please check your internet or API key."}