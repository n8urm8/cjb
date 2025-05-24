import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth0, AuthenticationError } from "@auth0/auth0-react";
import type { GetTokenSilentlyOptions } from "@auth0/auth0-react";
import type { Job } from "../components/JobCard"; // Assuming Job type is exported from JobCard

// API base URL - consider moving to a config file
const API_BASE_URL = "http://127.0.0.1:8000";

// --- API Functions ---
const fetchJobsAPI = async (): Promise<Job[]> => {
  const response = await fetch(`${API_BASE_URL}/jobs/`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status} fetching jobs`);
  }
  return response.json();
};

const createJobAPI = async (
  jobPayload: Omit<Job, "id"> & { id?: number }, 
  getAccessTokenSilently: (options?: GetTokenSilentlyOptions) => Promise<string> // Added options type for getAccessTokenSilently
): Promise<Job> => {
  const token = await getAccessTokenSilently({
    authorizationParams: {
      audience: import.meta.env.VITE_AUTH0_API_AUDIENCE,
    },
  });

  const response = await fetch(`${API_BASE_URL}/jobs/create_protected`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(jobPayload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || `HTTP error! status: ${response.status} creating job`);
  }
  return data;
};

// --- Custom Hooks ---

/**
 * Custom hook to fetch job listings.
 */
export const useFetchJobs = () => {
  return useQuery<Job[], Error>({
    queryKey: ['jobs'],
    queryFn: fetchJobsAPI, // Renamed to avoid conflict with hook name
  });
};

/**
 * Custom hook to create a protected job.
 * Handles Auth0 token acquisition and API call.
 */
export const useCreateProtectedJob = () => {
  const queryClient = useQueryClient();
  const { getAccessTokenSilently } = useAuth0();

  return useMutation<Job, Error, Omit<Job, "id"> & { id?: number }> ({
    mutationFn: (jobPayload) => createJobAPI(jobPayload, getAccessTokenSilently),
    onSuccess: (data) => {
      console.log("Job created successfully via hook:", data);
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (error) => {
      console.error("Error creating job via hook:", error.message);
      // The component using this hook can handle displaying specific error messages
      // based on the error object returned by the mutation.
    },
  });
};

// Re-export AuthenticationError if needed by components using these hooks for type checking
export { AuthenticationError };
