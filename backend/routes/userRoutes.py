from fastapi import APIRouter,HTTPException,Request
from .supabaseClient import get_supabase_client
import logging
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel,EmailStr,Field
from gotrue.errors import AuthApiError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
router = APIRouter()
supabase = get_supabase_client()

class userDetails(BaseModel):
    email: EmailStr
    newPassword: str = Field(...,min_length=6)
    confirmPassword:str =Field(...,min_length=6)
    phoneNo: str
    name: str

class loginDetails(BaseModel):
    email:EmailStr
    password: str= Field(...,min_length=6)


@router.post("/register")
def register(details: userDetails):
    if details.newPassword != details.confirmPassword:
        logger.error("Password mismatch")
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    response = supabase.auth.sign_up({
        "email": details.email,
        "password": details.newPassword,  
        "email_confirm": True,  
        "phone": details.phoneNo, 
        "user_metadata": {
            "display_name": details.name  
        }
    })

    logger.info("New user registered!")
    return response

@router.post("/login")
def login(details: loginDetails):
    
    try:
        response = supabase.auth.sign_in_with_password({
            "email": details.email,
            "password": details.password
        })

        if not response.user:
            raise HTTPException(status_code=401,detail="Invalid email or password")
        
        logger.info("Login successful!")
        return {"access_token": response.session.access_token, "refresh_token":response.session.refresh_token}

    except AuthApiError:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.post("/refresh")
def refresh_token(request: Request):
    try:
        refresh_token = request.headers.get("Authorization")
        if not refresh_token:
            raise HTTPException(status_code=400, detail="Refresh token required")

        response = supabase.auth.refresh_session(refresh_token)
        return {
            "access": response.session.access_token,
            "refresh": response.session.refresh_token
        }

    except AuthApiError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    except Exception as e:
        logger.error(f"Token refresh error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")