from fastapi import APIRouter,HTTPException
from .supabaseClient import get_supabase_client
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
router = APIRouter()
supabase = get_supabase_client()

#for loading the front page
#gets all the conversations as their titles only
@router.get("/")
def convHome():

    try:
        response = (
            supabase.table("Conversations")
            .select("*")
            .execute()
        )

        logger.info("All conversations fetched succesfully!")
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
        return response.data

    except Exception as e:
        logger.error(f"Error fetching messages: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch messages.")


