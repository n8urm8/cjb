import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Job } from "./JobCard";

interface JobFormProps {
  initialJob?: Partial<Job>;
  onSubmit: (job: Omit<Job, "id">) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

type JobFormFields = {
  title: string;
  company: string;
  location: string;
  job_type: string;
  description: string;
  url?: string;
};

const JobForm: React.FC<JobFormProps> = ({
  initialJob = {},
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Save Job",
}) => {
  const { control, handleSubmit, formState: { errors } } = useForm<JobFormFields>({
    defaultValues: {
      title: initialJob.title || "",
      company: initialJob.company || "",
      location: initialJob.location || "",
      job_type: initialJob.job_type || "",
      description: initialJob.description || "",
      url: initialJob.url || "",
    },
  });

  const onFormSubmit = (data: JobFormFields) => {
    onSubmit({
      ...data,
      url: data.url || undefined,
      posted_date: initialJob.posted_date || new Date().toISOString().split("T")[0],
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label className="block font-semibold mb-1">Job Title</label>
        <Controller
          name="title"
          control={control}
          rules={{ required: "Job title is required" }}
          render={({ field }) => (
            <Input type="text" {...field} aria-invalid={!!errors.title} />
          )}
        />
        {errors.title && <span className="text-red-600 text-xs">{errors.title.message}</span>}
      </div>
      <div>
        <label className="block font-semibold mb-1">Company</label>
        <Controller
          name="company"
          control={control}
          rules={{ required: "Company is required" }}
          render={({ field }) => (
            <Input type="text" {...field} aria-invalid={!!errors.company} />
          )}
        />
        {errors.company && <span className="text-red-600 text-xs">{errors.company.message}</span>}
      </div>
      <div>
        <label className="block font-semibold mb-1">Location</label>
        <Controller
          name="location"
          control={control}
          rules={{ required: "Location is required" }}
          render={({ field }) => (
            <Input type="text" {...field} aria-invalid={!!errors.location} />
          )}
        />
        {errors.location && <span className="text-red-600 text-xs">{errors.location.message}</span>}
      </div>
      <div>
        <label className="block font-semibold mb-1">Job Type</label>
        <Controller
          name="job_type"
          control={control}
          rules={{ required: "Job type is required" }}
          render={({ field }) => (
            <Input type="text" {...field} aria-invalid={!!errors.job_type} />
          )}
        />
        {errors.job_type && <span className="text-red-600 text-xs">{errors.job_type.message}</span>}
      </div>
      <div>
        <label className="block font-semibold mb-1">Description</label>
        <Controller
          name="description"
          control={control}
          rules={{ required: "Description is required" }}
          render={({ field }) => (
            <textarea
              className="w-full border rounded px-3 py-2"
              rows={5}
              aria-invalid={!!errors.description}
              {...field}
            />
          )}
        />
        {errors.description && <span className="text-red-600 text-xs">{errors.description.message}</span>}
      </div>
      <div>
        <label className="block font-semibold mb-1">URL (optional)</label>
        <Controller
          name="url"
          control={control}
          render={({ field }) => (
            <Input type="url" {...field} />
          )}
        />
      </div>
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default JobForm;
