from fastapi import APIRouter,HTTPException, Query
from .supabaseClient import get_supabase_client
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
router = APIRouter()
supabase = get_supabase_client()


#for loading the front page
#gets all the conversations as their titles only
@router.get("/")
def convHome(user_id: str = Query(...)):
    try:
        response = (
            supabase.table("Conversations")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        logger.info(f"All conversations fetched succesfully!")
        return response.data
    
    except Exception as e:
        logger.error(f"Error fetching conversations: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch conversations.")
    


#to fetch all messages of a particular conversation
@router.get("/{conv_id}")
def load_messages(conv_id:int):
    try:
        response = (
            supabase.table("Messages")
            .select("*")
            .eq("conv_id", conv_id)
            .execute()
        )
        logger.info(f"All previous messages of conversation no: {conv_id} are loaded!!")
        logger.info(f"Session before login: {supabase.auth.get_session()}")
        return response.data

    except Exception as e:
        logger.error(f"Error fetching messages: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch messages.")

@router.post("/save")
def save_message(payload: dict):
    try:
        conv_id = payload["conv_id"]
        data = {
            "conv_id": conv_id, 
            "sender": payload["sender"],
            "content": payload["content"],
            "created_at": payload['created_at']
        }
        response = supabase.table("Messages").insert(data).execute()
        
        
        logger.info(f"Message saved successfully in conversation no: {conv_id}!")
        return {"message": "Message saved successfully"}
    
    except Exception as e:
        logger.error(f"Error saving message: {e}")
        raise HTTPException(status_code=500, detail="Failed to save message")
    

@router.post("/newchat")
def startNewChat(payload: dict):
    user_id = payload['user_id']
    data = {
        "user_id": user_id,
        "created_at": payload['created_at'],
        "updated_at": payload['updated_at'],
        "title": payload['title']
    }
    try:
        response = supabase.table("Conversations").insert(data).execute()
        new_chat_id = response.data[0]['id']
        logger.info(f"New chat started successfully for user_id: {user_id} with chat_id: {new_chat_id}!")
        return {"message": "New chat started successfully", "chat_id": new_chat_id}
    
    except Exception as e:
        logger.error(f"Error starting new chat: {e}")
        raise HTTPException(status_code=500, detail="Failed to start new chat")

