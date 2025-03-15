from langchain.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from supabaseClient import get_supabase_client

supabase = get_supabase_client()

CHROMA_PATH = "./chroma"

def get_embedding():
    return HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Load the existing ChromaDB
db = Chroma(persist_directory=CHROMA_PATH, embedding_function=get_embedding())

# Fetch existing documents with embeddings
existing_items = db.get(include=["embeddings", "metadatas", "documents"])

if not existing_items["ids"]:  # Check if the list is empty
    print("No documents found in ChromaDB.")
else:
    print(f"Found {len(existing_items['ids'])} documents.")
# Extract data
ids = existing_items["ids"]
embeddings = existing_items["embeddings"]
documents = existing_items["documents"]
metadata = existing_items["metadatas"]  # If you stored metadata


# Insert into Supabase
for i in range(len(ids)):
    data = {
        "content": documents[i],  
        "metadata": metadata[i],
        "embedding": embeddings[i].tolist(),  
    }
    
    response = supabase.table("vectors").insert(data).execute()

print("Done!")

