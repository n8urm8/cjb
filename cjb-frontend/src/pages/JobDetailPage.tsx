import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { type Job } from "../components/JobCard"; // Assuming Job type is exported from JobCard

const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://127.0.0.1:8000/jobs/${jobId}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError(`Job with ID '${jobId}' not found.`);
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          setJob(null);
        } else {
          const data: Job = await response.json();
          setJob(data);
        }
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred while fetching job details.");
        }
        setJob(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl text-gray-500">Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!job) {
    // This case should ideally be handled by the error state if API returns 404
    // but as a fallback:
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">Job not found!</h1>
        <p>The job with ID '{jobId}' could not be located.</p>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto p-8 bg-white shadow-lg rounded-lg mt-8"
      style={{
        color: "var(--color-black)",
      }}
    >
      <h1 className="text-4xl font-bold text-blue-700 mb-4">{job.title}</h1>
      <p className="text-xl text-gray-800 mb-2">
        <strong>Company:</strong> {job.company}
      </p>
      <p className="text-md text-gray-600 mb-2">
        <strong>Location:</strong> {job.location}
      </p>
      <p className="text-sm text-gray-500 mb-6">
        <em>Posted: {job.posted_date}</em>
      </p>

      <div className="prose max-w-none">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3">
          Job Description
        </h2>
        {/* Assuming description might be long, consider how to render it (e.g., dangerouslySetInnerHTML if it's HTML, or pre-wrap for text) */}
        <p className="whitespace-pre-wrap">{job.description}</p>
      </div>

      <button
        className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
        onClick={() => alert("Apply button clicked for job: " + job.title)}
      >
        Apply Now (Placeholder)
      </button>
    </div>
  );
};

export default JobDetailPage;
