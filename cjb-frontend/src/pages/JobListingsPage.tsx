import React, { useState, useMemo } from "react"; // Removed useEffect
import { useAuth0, AuthenticationError } from "@auth0/auth0-react";
import { useFetchJobs, useCreateProtectedJob, useDeleteJob } from "../hooks/jobHooks"; // Corrected path
import JobCard, { type Job } from "../components/JobCard";
import { Button } from "@/components/ui/button"; // Import Button for consistency
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router";

// Sample job data has been removed, data will be fetched from API
// The sampleJobs array has been completely removed.

const JobListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated, user } = useAuth0(); // user.sub = user_id
  const userId = user?.sub;
  const userRole = user?.role;
  // testResponse will now be derived from useMutation's state or not used directly if we update UI based on mutation status
  const [testResponseDisplay, setTestResponseDisplay] = useState<string | null>(
    null
  );

  // Use custom hook to fetch jobs
  const {
    data: jobs = [],
    isLoading: isLoadingJobs,
    isError: isErrorJobs,
    error: errorJobs,
  } = useFetchJobs();

  // Use custom hook to create a protected job
  const createJobMutation = useCreateProtectedJob();

  // Function to handle the actual mutation call with a payload
  const handleCreateProtectedJob = () => {
    const sampleJobPayload: Omit<Job, "id"> & { id?: number } = {
      id: Math.floor(Math.random() * 1000) + 100, // ID is usually set by the backend
      title: "Protected Test Job from Hook",
      company: "Hook Test Corp",
      location: "Secure Hook Location, NC",
      description:
        "This job was created via a protected endpoint using a custom React Query hook.",
      posted_date: new Date().toISOString().split("T")[0],
      job_type: "Full-time (Hook Test)",
      url: "https://example.com/protected-hook-test",
    };
    setTestResponseDisplay(null); // Clear previous response
    createJobMutation.mutate(sampleJobPayload, {
      onSuccess: (data: Job) => {
        // Added type for data
        setTestResponseDisplay(`Success: ${JSON.stringify(data, null, 2)}`);
      },
      onError: (error: Error) => {
        // Added type for error
        if (
          error instanceof AuthenticationError &&
          error.error &&
          error.error_description
        ) {
          setTestResponseDisplay(
            `Auth0 Error: ${error.error} - ${error.error_description}`
          );
        } else {
          setTestResponseDisplay(`Error: ${error.message}`);
        }
      },
    });
  };

  const filteredJobs = useMemo(() => {
    if (!searchTerm) {
      return jobs; // jobs from useQuery
    }
    return jobs.filter(
      (job: Job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  return (
    <div
      className="container mx-auto p-4"
      style={{
        color: "var(--color-black)",
      }}
    >
      <h1
        className="text-4xl font-bold text-center my-8"
        style={{ color: "var(--color-primary)" }}
      >
        Charlotte NC Tech Jobs
      </h1>
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={() => {
          /* Can be used for API calls later */
        }}
      />

      {/* Add Job button for authenticated users */}
      {isAuthenticated && (
        <div className="my-6 flex flex-col items-center gap-2">
          <Button onClick={() => navigate("/jobs/add")} variant="default">
            + Add New Job
          </Button>
          {/* Test button for protected route (dev only) */}
          <Button onClick={handleCreateProtectedJob} variant="secondary">
            Test Create Protected Job
          </Button>
          {createJobMutation.isPending && (
            <p
              className="text-center"
              style={{ color: "var(--color-primary-light)" }}
            >
              Creating job...
            </p>
          )}
          {createJobMutation.isError && (
            <p
              className="text-center"
              style={{ color: "var(--color-secondary)" }}
            >
              {testResponseDisplay ||
                createJobMutation.error?.message ||
                "Unknown error creating job"}
            </p>
          )}
          {createJobMutation.isSuccess && (
            <p
              className="text-center"
              style={{ color: "var(--color-primary)" }}
            >
              Job created successfully!
            </p>
          )}
          {/* Display the raw response in a pre tag if testResponseDisplay is set and we are not in pending state */}
          {testResponseDisplay && !createJobMutation.isPending && (
            <pre
              className="mt-4 p-4 rounded text-left text-sm overflow-x-auto"
              style={{
                background: "var(--color-primary-light)",
                color: "var(--color-black)",
              }}
            >
              {testResponseDisplay}
            </pre>
          )}
        </div>
      )}
      {/* End of add/test buttons */}

      {isLoadingJobs && (
        <p
          className="text-center text-xl my-10"
          style={{ color: "var(--color-primary-light)" }}
        >
          Loading jobs...
        </p>
      )}
      {isErrorJobs && (
        <p
          className="text-center text-xl my-10"
          style={{ color: "var(--color-secondary)" }}
        >
          Error fetching jobs: {errorJobs?.message || "Unknown error"}
        </p>
      )}
      {!isLoadingJobs && !isErrorJobs && jobs && filteredJobs.length === 0 && (
        // Added check for jobs existence before accessing length
        <p className="text-center text-gray-500 text-xl my-10">
          No jobs found matching your criteria.
        </p>
      )}
      {!isLoadingJobs && !isErrorJobs && filteredJobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job: Job) => {
            // Show edit/delete if user is owner or admin
            const isOwner = userId && job.user_id && userId === job.user_id;
            const isAdmin = userRole === "admin";
            return (
              <div key={job.id} className="relative group">
                <JobCard job={job} />
                {(isOwner || isAdmin) && (
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/jobs/${job.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <DeleteJobButton jobId={job.id} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Inline component for delete button with confirmation and loading/error state
const DeleteJobButton: React.FC<{ jobId: number }> = ({ jobId }) => {
  const deleteJobMutation = useDeleteJob();
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      deleteJobMutation.mutate({ jobId });
    }
  };
  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={handleDelete}
      disabled={deleteJobMutation.isPending}
      title="Delete job"
    >
      {deleteJobMutation.isPending ? "Deleting..." : "Delete"}
    </Button>
  );
};

export default JobListingsPage;
