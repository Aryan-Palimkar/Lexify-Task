from fastapi import APIRouter,HTTPException, Query
from .supabaseClient import get_supabase_client
import logging
from pydantic import BaseModel
from datetime import datetime, timezone
from langchain_google_genai import GoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv
import os

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise HTTPException(status_code=500, detail="GEMINI_API_KEY not found in environment variables")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
router = APIRouter()
supabase = get_supabase_client()

class query(BaseModel):
    query_text : str

def get_embedding():
    return HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

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

PROMPT_TEMPLATE = '''
You are a legal assistant that helps users understand legal terms and documents.
Based on the following information retrieved from the database, provide a clear, concise,
Make it seem like a natural conversation and not like a bot-human interaction while being professional.
Do not ever mention "Based on the documents" or anything similar.
Sources will be a list with each item in the format - "data\\THE COMPANIES ACT.pdf:4:1", in this example, "THE COMPANIES ACT.pdf" is pdf file and 4 is page number
From the Sources: {sources}, return appropriate sources at the end of response in the format - "pdfname - Page X" (replace pdfname and X with actual source).

- Only use the provided data to enhance the response.
- If a legal definition is missing from the retrieved data, you may provide a general definition.
- If the user's question is unclear or no specific term is found, suggest relevant legal topics.

---

Context:
{context}

User Question:
{question}

Provide a response using the retrieved information:
'''

#asking a query to the chatbot
@router.post("/{conv_id}/ask")
def query_rag(request: query,conv_id:int):

    #add the user's conversation to the database
    supabase.table("Messages").insert({"created_at": datetime.now(timezone.utc).isoformat(), "conv_id": conv_id, "sender": "user", "content": request.query_text}).execute()

    #get the response for the query from the LLM
    embedding_function = get_embedding()
    query_embedding = embedding_function.embed_query(request.query_text)

    results = (
        supabase.rpc("match_vectors", {"query_embedding": query_embedding, "match_count": 5})
        .execute()
    )
    model = GoogleGenerativeAI(model="gemini-2.0-flash", api_key=GEMINI_API_KEY)

    response = (
            supabase.table("Conversations")
            .select("title")
            .eq("id", conv_id)
            .execute()
        )
    if response.data[0]['title']=="New Conversation":
        prompt_template = ChatPromptTemplate.from_template("Generate a very short title(it should be text, not markdown) from the given query: {query}")
        prompt = prompt_template.format(query=request.query_text)
        new_title = model.invoke(prompt).strip()
        supabase.table("Conversations").update({"title": new_title}).eq("id", conv_id).execute()

    if not results.data:
        return "No relevant legal information was found. Try rephrasing your question or exploring related topics."

    context_text = "\n\n---\n\n".join([item["content"] for item in results.data])
    sources = [item["metadata"]["id"] for item in results.data]

    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=request.query_text, sources=sources)

    response_text = model.invoke(prompt)

    formatted_response = f"Response: {response_text}\nSources: {sources}\n"
    print(formatted_response)

    #add the bot's message to the database
    supabase.table("Messages").insert({"created_at":datetime.now(timezone.utc).isoformat(),"conv_id": conv_id, "sender": "bot", "content": formatted_response}).execute()

    return response_text