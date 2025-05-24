from sqlalchemy import Column, Integer, String, Date, Text
from sqlalchemy.orm import relationship # relationship might be used later for foreign keys
from .database import Base
import datetime

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    company = Column(String, nullable=False)
    location = Column(String, nullable=False)
    description = Column(Text, nullable=True) # Using Text for potentially longer descriptions
    posted_date = Column(Date, default=datetime.date.today, nullable=False)
    job_type = Column(String, nullable=False) # e.g., "Full-time", "Part-time", "Contract"
    url = Column(String, nullable=True)
