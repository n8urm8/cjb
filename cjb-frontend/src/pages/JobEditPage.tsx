import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import JobForm from "../components/JobForm";
import { useUpdateJob, useFetchJobs } from "../hooks/jobHooks";
import type { Job } from "../components/JobCard";

const JobEditPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { data: jobs = [] } = useFetchJobs();
  const updateJobMutation = useUpdateJob();
  const [formError, setFormError] = useState<string | null>(null);

  const job = jobs.find((j) => j.id === Number(jobId));

  if (!jobId) {
    return <div className="p-4 text-red-600">No job ID provided.</div>;
  }
  if (!job) {
    return <div className="p-4 text-red-600">Job not found.</div>;
  }

  const handleSubmit = (jobPayload: Omit<Job, "id">) => {
    setFormError(null);
    updateJobMutation.mutate(
      { jobId: Number(jobId), jobPayload },
      {
        onSuccess: () => navigate(`/jobs/${jobId}`),
        onError: (error) => setFormError(error.message),
      }
    );
  };

  return (
    <div className="container mx-auto max-w-xl mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Job</h1>
      <JobForm
        initialJob={job}
        onSubmit={handleSubmit}
        isLoading={updateJobMutation.isPending}
        submitLabel="Update Job"
      />
      {formError && <div className="mt-4 text-red-600 text-center">{formError}</div>}
    </div>
  );
};

export default JobEditPage;
