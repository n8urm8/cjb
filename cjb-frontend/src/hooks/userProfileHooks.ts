import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import type { GetTokenSilentlyOptions } from "@auth0/auth0-react";
// TODO: Update this import path if BackendUserProfile is moved to a types file
import type { BackendUserProfile } from "../context/UserProfileContext";

const API_BASE_URL = "http://127.0.0.1:8000";

// --- API Functions ---

/**
 * Fetches the current user's profile. If it doesn't exist, the backend creates it.
 */
const fetchUserProfileAPI = async (
  getAccessTokenSilently: (options?: GetTokenSilentlyOptions) => Promise<string>
): Promise<BackendUserProfile> => {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not defined");
  }
  const token = await getAccessTokenSilently({
    authorizationParams: {
      audience: import.meta.env.VITE_AUTH0_API_AUDIENCE,
    },
  });

  const response = await fetch(`${API_BASE_URL}/user-profiles/`, {
    method: "POST", // Backend endpoint creates if not exists, or returns existing
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.detail ||
        `HTTP error! status: ${response.status} fetching user profile`
    );
  }
  return data;
};

export interface UpdateUserProfilePayload {
  full_name?: string | null;
  bio?: string | null;
  profile_picture_url?: string | null;
}

/**
 * Updates the current user's profile.
 */
const updateUserProfileAPI = async (
  payload: UpdateUserProfilePayload,
  getAccessTokenSilently: (options?: GetTokenSilentlyOptions) => Promise<string>
): Promise<BackendUserProfile> => {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not defined");
  }
  const token = await getAccessTokenSilently({
    authorizationParams: {
      audience: import.meta.env.VITE_AUTH0_API_AUDIENCE,
    },
  });

  const response = await fetch(`${API_BASE_URL}/user-profiles/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.detail ||
        `HTTP error! status: ${response.status} updating user profile`
    );
  }
  return data;
};

// --- TanStack Query Hooks ---

// --- Admin: Fetch all user profiles ---
export const useFetchAllUserProfiles = () => {
  const { getAccessTokenSilently, isAuthenticated, isLoading: isLoadingAuth } = useAuth0();
  return useQuery<BackendUserProfile[], Error>({
    queryKey: ["userProfiles", "all"],
    queryFn: async () => {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_API_AUDIENCE,
        },
      });
      const response = await fetch(`${API_BASE_URL}/user-profiles/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || `HTTP error! status: ${response.status} fetching all user profiles`);
      }
      return data;
    },
    enabled: isAuthenticated && !isLoadingAuth,
  });
};

// --- Admin: Update any user profile ---
export interface AdminUpdateUserProfilePayload {
  user_id: string;
  email?: string;
  full_name?: string | null;
  bio?: string | null;
  profile_picture_url?: string | null;
  role?: string;
}

export const useUpdateUserProfileAdmin = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation<BackendUserProfile, Error, AdminUpdateUserProfilePayload>({
    mutationFn: async (payload: AdminUpdateUserProfilePayload) => {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_API_AUDIENCE,
        },
      });
      const response = await fetch(`${API_BASE_URL}/user-profiles/${payload.user_id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || `HTTP error! status: ${response.status} updating user profile (admin)`);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfiles", "all"] });
    },
  });
};

export const useFetchUserProfile = () => {
  const {
    getAccessTokenSilently,
    isAuthenticated,
    isLoading: isLoadingAuth,
  } = useAuth0();

  return useQuery<BackendUserProfile, Error>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["userProfile", "me"],
    queryFn: () => fetchUserProfileAPI(getAccessTokenSilently),
    enabled: isAuthenticated && !isLoadingAuth, // Only run if authenticated and auth loading is finished
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on auth errors or 404 (though POST should handle 404 by creating)
      if (
        error.message.includes("401") ||
        error.message.includes("403") ||
        error.message.includes("404")
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useUpdateUserProfile = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation<BackendUserProfile, Error, UpdateUserProfilePayload>({
    mutationFn: (payload: UpdateUserProfilePayload) =>
      updateUserProfileAPI(payload, getAccessTokenSilently),
    onSuccess: () => {
      // Update the cache for ['userProfile', 'me'] with the new data
      // The queryKey for setQueryData should match the one used in useFetchUserProfile for consistency
      // queryClient.setQueryData(['userProfile', 'me', isAuthenticated], data); // Avoid direct manipulation if refetch is better
      // Invalidate the query to refetch and ensure data consistency.
      // The queryKey here should match the one used in useFetchUserProfile.
      queryClient.invalidateQueries({ queryKey: ["userProfile", "me"] }); // Invalidate all queries starting with ['userProfile', 'me']
    },
    // Optionally, add onError for error handling specific to the mutation
    // onError: (error, variables, context) => { ... }
  });
};
