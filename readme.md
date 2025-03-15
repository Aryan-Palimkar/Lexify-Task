# Lexify Task

## Overview

Lexify is a legal chatbot that allows users to ask legal-related questions and retrieve relevant legal definitions or documents. The system extracts key legal terms from user queries using AI techniques and performs a Retrieval-Augmented Generation (RAG) process:A brief description

## Prerequisites
```bash
Ensure you have the following installed:

Python 3.11+
Node.js and npm
Supabase account (for database and authentication)
```

## Clone the Repository

```bash
 git clone https://github.com/Aryan-Palimkar/Lexify-Task.git
 cd Lexify-Task
```

## Running the backend


```bash
 cd backend
 python -m venv venv
 .venv/Scripts/Activate
 pip install -r requirements.txt
 cp .env.example .env
 uvicorn main:app --reload
```

## Running the frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
    
## Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)


## Technologies used

#### FastAPI

FastAPI is a modern, high-performance web framework for building APIs with Python. It is designed for speed and ease of use, making it ideal for backend development. Pydantic's BaseModel was also used to define request and response schemas easily.

#### React
React is a JavaScript library for building user interfaces. It enables the creation of dynamic, component-based frontend applications.

In our project, React was used to:

Build an interactive and responsive UI for querying the chatbot
Handle user authentication and session management
Display conversation history in an intuitive manner
Communicate with the FastAPI backend via API requests
We used Tailwind CSS for styling and React Query for efficient data fetching and caching.

#### Supabase

Supabase is an open-source backend-as-a-service that provides a PostgreSQL database, authentication, file storage, and real-time capabilities. It supports vector embeddings for similarity search, making it useful for AI applications. Supabase provided an easy way to manage data, users, and APIs without complex setup.


#### ChromaDB

ChromaDB is an open-source vector database used for storing and retrieving vector embeddings efficiently. It enables fast similarity searches, making it useful for AI and machine learning applications. Initially, we used ChromaDB to store embeddings locally in SQLite before transferring them to Supabase for better scalability

#### LangChain

LangChain is a framework that helps build applications using large language models (LLMs). It simplifies working with AI by providing tools for text generation, document processing, embeddings, and vector storage.

In our project, we used LangChain to:
- Load and process PDFs (PyPDFDirectoryLoader, RecursiveCharacterTextSplitter)
- Generate AI responses (GoogleGenerativeAI, ChatPromptTemplate)
- Convert text into embeddings (HuggingFaceEmbeddings)
- Store and retrieve vector data (Chroma)


## Authors

- [Pradyun D](https://github.com/Prady007-1981)
- [Aryan Palimkar](https://github.com/Aryan-Palimkar)
- [Vivek Kashyap](https://github.com/Vivek-k7)


## Environment Variables

```bash
# Frontend .env
 VITE_API_URL="http://127.0.0.1:8000"
 VITE_SUPABASE_URL=your_url
 VITE_SUPABASE_KEY=your_key
# Backend .env
 SUPABASE_URL = your_url
 SUPABASE_KEY = your_key
 GEMINI_API_KEY = your_api_key
```