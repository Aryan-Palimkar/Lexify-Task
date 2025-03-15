from fastapi import APIRouter,HTTPException,Request
from supabaseClient import get_supabase_client
import logging
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

#register a new user
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

#login a new user
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

#update the access and refresh token
@router.post("/refresh")
def refresh_token(request: Request):
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=400, detail="Refresh token required")

        refresh_token = auth_header.split(" ")[1]
        logger.info(f"Refreshing token with: {refresh_token}")

        response = supabase.auth.refresh_session(refresh_token)

        logger.info(f"New Access Token: {response.session.access_token}")
        logger.info(f"New Refresh Token: {response.session.refresh_token}")
        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token
        }

    except AuthApiError as e:
        logger.error(f"Auth error during refresh: {e}")
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    except Exception as e:
        logger.error(f"Token refresh error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


#logout the user
@router.post("/logout")
def logout():
    try:
        logger.info("User logged out successfully!")
        return {"message": "User logged out successfully"}
    except Exception as e:
        logger.error(f"Error logging out: {e}")
        raise HTTPException(status_code=500, detail="Failed to log out")
