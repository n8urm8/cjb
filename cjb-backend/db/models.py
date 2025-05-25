from sqlalchemy import Column, Integer, String, Date, Text, DateTime # Added DateTime
from sqlalchemy.orm import relationship # relationship might be used later for foreign keys
from .database import Base
import datetime

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True, nullable=False) # From Auth0 or other auth provider
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    profile_picture_url = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    role = Column(String, nullable=False, default="user")  # Added role
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, nullable=False, index=True)  # Auth0 user ID, links to UserProfile.user_id
    title = Column(String, index=True, nullable=False)
    company = Column(String, nullable=False)
    location = Column(String, nullable=False)
    description = Column(Text, nullable=True) # Using Text for potentially longer descriptions
    posted_date = Column(Date, default=datetime.date.today, nullable=False)
    job_type = Column(String, nullable=False) # e.g., "Full-time", "Part-time", "Contract"
    url = Column(String, nullable=True)
    # Optionally, set up relationship for ORM convenience:
    # poster = relationship("UserProfile", primaryjoin="Job.user_id==UserProfile.user_id", backref="jobs")
