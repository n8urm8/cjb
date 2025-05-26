import React, { useState } from "react";
import { useNavigate } from "react-router";
import JobForm from "../components/JobForm";
import { useCreateProtectedJob } from "../hooks/jobHooks";
import type { Job } from "../components/JobCard";

const JobAddPage: React.FC = () => {
  const navigate = useNavigate();
  const createJobMutation = useCreateProtectedJob();
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (jobPayload: Omit<Job, "id">) => {
    setFormError(null);
    createJobMutation.mutate(jobPayload, {
      onSuccess: (data) => navigate(`/jobs/${data.id}`),
      onError: (error) => setFormError(error.message),
    });
  };

  return (
    <div className="container mx-auto max-w-xl mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Add New Job</h1>
      <JobForm
        onSubmit={handleSubmit}
        isLoading={createJobMutation.isPending}
        submitLabel="Create Job"
      />
      {formError && <div className="mt-4 text-red-600 text-center">{formError}</div>}
    </div>
  );
};

export default JobAddPage;
