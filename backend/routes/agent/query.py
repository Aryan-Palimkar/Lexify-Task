from langchain.vectorstores.chroma import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain_google_genai import GoogleGenerativeAI

from .database_populator import get_embedding

CHROMA_PATH = "./chroma"

PROMPT_TEMPLATE = '''
You are a legal assistant that helps users understand legal terms and documents.
Based on the following information retrieved from the database, provide a clear, concise,
and user-friendly response to the user's question.

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

def query_rag(query_text: str):
    embedding_function = get_embedding()
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    results = db.similarity_search_with_score(query_text, k=5)

    if not results:
        return "No relevant legal information was found. Try rephrasing your question or exploring related topics."

    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=query_text)

    model = GoogleGenerativeAI(model="gemini-2.0-flash", api_key="AIzaSyBhocJdQ4GOt3wrorTz4dxqdmIGNUZNlrQ")
    response_text = model.invoke(prompt)

    sources = [doc.metadata.get("id", "Unknown") for doc, _score in results]
    
    formatted_response = f"Response: {response_text}\nSources: {sources}"
    print(formatted_response)
    
    return response_text

response = query_rag("What is a contract?")
print(response)