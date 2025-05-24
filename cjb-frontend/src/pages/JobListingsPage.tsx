import React, { useState, useMemo } from "react"; // Removed useEffect
import { useAuth0, AuthenticationError } from "@auth0/auth0-react";
import { useFetchJobs, useCreateProtectedJob } from "../hooks/jobHooks"; // Corrected path
import JobCard, { type Job } from "../components/JobCard";
import { Button } from "@/components/ui/button"; // Import Button for consistency
import SearchBar from "../components/SearchBar";

// Sample job data has been removed, data will be fetched from API
// The sampleJobs array has been completely removed.

const JobListingsPage: React.FC = () => {
  
  

  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated } = useAuth0(); // Removed unused getAccessTokenSilently
  // testResponse will now be derived from useMutation's state or not used directly if we update UI based on mutation status
  const [testResponseDisplay, setTestResponseDisplay] = useState<string | null>(null);

  // Use custom hook to fetch jobs
  const { data: jobs = [], isLoading: isLoadingJobs, isError: isErrorJobs, error: errorJobs } = useFetchJobs();

  // Use custom hook to create a protected job
  const createJobMutation = useCreateProtectedJob();

  // Function to handle the actual mutation call with a payload
  const handleCreateProtectedJob = () => {
    const sampleJobPayload: Omit<Job, "id"> & { id?: number } = {
      id: Math.floor(Math.random() * 1000) + 100, // ID is usually set by the backend
      title: "Protected Test Job from Hook",
      company: "Hook Test Corp",
      location: "Secure Hook Location, NC",
      description: "This job was created via a protected endpoint using a custom React Query hook.",
      posted_date: new Date().toISOString().split("T")[0],
      job_type: "Full-time (Hook Test)",
      url: "https://example.com/protected-hook-test",
    };
    setTestResponseDisplay(null); // Clear previous response
    createJobMutation.mutate(sampleJobPayload, {
      onSuccess: (data: Job) => { // Added type for data
        setTestResponseDisplay(`Success: ${JSON.stringify(data, null, 2)}`);
      },
      onError: (error: Error) => { // Added type for error
        if (error instanceof AuthenticationError && error.error && error.error_description) {
          setTestResponseDisplay(`Auth0 Error: ${error.error} - ${error.error_description}`);
        } else {
          setTestResponseDisplay(`Error: ${error.message}`);
        }
      }
    });
  };

  const filteredJobs = useMemo(() => {
    if (!searchTerm) {
      return jobs; // jobs from useQuery
    }
    return jobs.filter((job: Job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 my-8">
        Charlotte NC Tech Jobs
      </h1>
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={() => {
          /* Can be used for API calls later */
        }}
      />

      {/* Test button for protected route */}
      {isAuthenticated && (
        <div className="my-6 text-center">
          <Button
            onClick={handleCreateProtectedJob}
          >
            Test Create Protected Job
          </Button>
          {createJobMutation.isPending && <p className="text-center text-blue-500">Creating job...</p>}
          {createJobMutation.isError && (
            <p className="text-center text-red-500">
              {testResponseDisplay || createJobMutation.error?.message || 'Unknown error creating job'}
            </p>
          )}
          {createJobMutation.isSuccess && (
            <p className="text-center text-green-500">Job created successfully!</p>
          )}
          {/* Display the raw response in a pre tag if testResponseDisplay is set and we are not in pending state */}
          {testResponseDisplay && !createJobMutation.isPending && (
            <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-left text-sm overflow-x-auto">
              {testResponseDisplay}
            </pre>
          )}

        </div>
      )}
      {/* End of test button */}

      {isLoadingJobs && <p className="text-center text-gray-500 text-xl my-10">Loading jobs...</p>}
      {isErrorJobs && <p className="text-center text-red-500 text-xl my-10">Error fetching jobs: {errorJobs?.message || 'Unknown error'}</p>}
      {!isLoadingJobs && !isErrorJobs && jobs && filteredJobs.length === 0 && (
        // Added check for jobs existence before accessing length
        <p className="text-center text-gray-500 text-xl my-10">
          No jobs found matching your criteria.
        </p>
      )}
      {!isLoadingJobs && !isErrorJobs && filteredJobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job: Job) => ( // Added type for job
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListingsPage;
