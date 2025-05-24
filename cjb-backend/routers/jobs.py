from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from auth.utils import get_current_user # Import the dependency
from pydantic import BaseModel, HttpUrl
import datetime

from db.database import get_db
from db import models as db_models # Import SQLAlchemy models as db_models

router = APIRouter(
    prefix="/jobs",  # All routes in this router will start with /jobs
    tags=["jobs"],   # Groups routes in the OpenAPI docs
)

# --- Pydantic Models ---
# Model for returning a job (includes id and posted_date)
class Job(BaseModel):
    id: int
    title: str
    company: str
    location: str
    description: str
    posted_date: datetime.date
    job_type: str
    url: Optional[HttpUrl] = None

    class Config:
        from_attributes = True # Changed from orm_mode = True for Pydantic v2

# Model for creating a job (excludes id and posted_date, which are auto-generated or defaulted)
class JobCreate(BaseModel):
    title: str
    company: str
    location: str
    description: str
    job_type: str # e.g., "Full-time", "Part-time", "Contract"
    url: Optional[HttpUrl] = None


@router.get("/", response_model=List[Job])
async def get_jobs_route(db: Session = Depends(get_db)):
    jobs = db.query(db_models.Job).all()
    return jobs

@router.get("/{job_id}", response_model=Job)
async def get_job_by_id_route(job_id: int, db: Session = Depends(get_db)):
    job = db.query(db_models.Job).filter(db_models.Job.id == job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail=f"Job with id {job_id} not found")
    return job

@router.post("/create_protected", response_model=Job, status_code=201) # Return the created job object
async def create_job_protected_route(
    new_job_data: JobCreate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("sub") # 'sub' is typically the user ID in Auth0 tokens
    print(f"User {user_id} is attempting to create a job: {new_job_data.title}")

    # Create a new SQLAlchemy Job instance from the Pydantic model data
    job_data_dict = new_job_data.model_dump()
    if job_data_dict.get("url") is not None:
        job_data_dict["url"] = str(job_data_dict["url"]) # Convert HttpUrl to string

    db_job = db_models.Job(**job_data_dict)
    
    # Add to session, commit, and refresh to get DB-generated values (like id, posted_date)
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    
    print(f"Job '{db_job.title}' (ID: {db_job.id}) created successfully by user {user_id}.")
    return db_job


