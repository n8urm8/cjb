import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Link } from "react-router";
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
  user_id?: string; // Add user_id for ownership checks
}

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
        <span className="text-xs text-muted-foreground">
          Posted on: {job.posted_date}
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 flex-grow">
        <div className="text-sm text-muted-foreground">
          {job.location} -{" "}
          <span className="text-primary font-semibold">{job.job_type}</span>
        </div>
        <CardDescription className="line-clamp-3 mb-2">
          {job.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="mt-auto pt-4">
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
      </CardFooter>
    </Card>
  );
};

export default JobCard;
