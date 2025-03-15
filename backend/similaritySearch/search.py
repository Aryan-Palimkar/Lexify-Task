from langchain_community.embeddings import HuggingFaceEmbeddings
from supabaseClient import get_supabase_client

supabase = get_supabase_client()

def get_embedding():
    return HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
embedding_function = get_embedding()

#embeds the query
query_embedding = embedding_function.embed_query("How is waveoptics different from geometric optics")

#gets the top 5 matching vectors
results = (
    supabase.rpc("match_vectors", {"query_embedding": query_embedding, "match_count": 5})
    .execute()
)

print(results.data[0]["metadata"])