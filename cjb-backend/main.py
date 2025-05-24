from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import jobs as jobs_router 
from db.database import Base, engine # Import Base and engine from our db setup

# Create database tables if they don't exist
# This should be called once when the application starts.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Charlotte Job Board API",
    description="API for managing job listings for the Charlotte Job Board.",
    version="0.1.0",
)

# --- CORS Configuration ---
origins = [
    "http://localhost",         # Allow localhost (any port)
    "http://localhost:5173",    # Default Vite dev server
    "http://127.0.0.1",       # Allow 127.0.0.1 (any port)
    "http://127.0.0.1:5173",  # Vite dev server on 127.0.0.1
    # Add your frontend production URL here when you deploy
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods (GET, POST, etc.)
    allow_headers=["*"], # Allow all headers
)

# --- Include Routers ---
app.include_router(jobs_router.router) # Include the jobs router

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Charlotte Job Board API!"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    # This is for local development run directly with `python main.py`
    # For production, Uvicorn is typically run as a separate process.
    uvicorn.run(app, host="0.0.0.0", port=8000)
