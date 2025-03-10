from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chatRoutes import router as chatRouter
from routes.userRoutes import router as userRouter

app = FastAPI()
app.include_router(chatRouter)
app.include_router(userRouter)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now (we'll adjust later if needed)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)
