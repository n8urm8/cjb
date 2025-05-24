import React from 'react';
import { Link } from 'react-router';
import { Button } from "@/components/ui/button";

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  posted_date: string;
  job_type: string;
  url?: string;
}

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="bg-card text-card-foreground border rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col h-full">
      {/* Main content area, allows description to grow */}
      <div className="flex-grow">
        <h2 className="text-xl font-semibold text-card-foreground mb-2">{job.title}</h2>
        <p className="text-xs text-muted-foreground mb-1">
          Posted on: {job.posted_date}
        </p>
        <p className="text-sm text-muted-foreground mb-3">
          {job.location} - <span className="text-primary font-semibold">{job.job_type}</span>
        </p>
        <p className="text-sm text-card-foreground/90 line-clamp-3 mb-4">
          {job.description}
        </p>
      </div>
      {/* Button area, pushed to the bottom */}
      <div className="mt-auto pt-4"> {/* pt-4 provides space above button if content is short */}
        {job.url ? (
          <Button asChild className="w-full">
            <a href={job.url} target="_blank" rel="noopener noreferrer">
              Apply / View Details
            </a>
          </Button>
        ) : (
          <Button asChild className="w-full">
            <Link to={`/jobs/${job.id}`}>View Details</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
