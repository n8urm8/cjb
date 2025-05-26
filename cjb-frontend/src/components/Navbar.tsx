import React from "react";
import { Link } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { CircuitBoard } from "lucide-react";
import LoginButton from "./auth/LoginButton";
import LogoutButton from "./auth/LogoutButton";
import { useUserProfile } from "../context/UserProfileContext";
import { useFetchUserProfile } from "../hooks/userProfileHooks"; // Added import

const Navbar: React.FC = () => {
  const { isAuthenticated, user, isLoading: isLoadingAuth } = useAuth0(); // Renamed isLoading to isLoadingAuth for clarity
  const { setProfile, setIsLoadingProfile: setContextLoading } =
    useUserProfile(); // Renamed setIsLoadingProfile for clarity

  // Use the new hook to fetch profile data
  const {
    data: userProfile,
    error: fetchProfileError,
    isLoading: isLoadingProfileData,
    isSuccess: isProfileFetchSuccess,
    isError: isProfileFetchError,
  } = useFetchUserProfile();

  useEffect(() => {
    if (!isAuthenticated && !isLoadingAuth) {
      // If user is not authenticated and auth is not loading, clear profile and set context loading to false
      setProfile(null);
      setContextLoading(false);
      return;
    }

    if (isLoadingAuth) {
      // If auth is loading, reflect this in context (optional, as useFetchUserProfile has its own loading)
      setContextLoading(true);
      return;
    }

    // Handle states from useFetchUserProfile
    if (isLoadingProfileData) {
      setContextLoading(true);
    } else if (isProfileFetchSuccess && userProfile) {
      setProfile(userProfile);
      setContextLoading(false);
      console.log("User profile fetched via hook:", userProfile);
    } else if (isProfileFetchError) {
      console.error("Error fetching user profile via hook:", fetchProfileError);
      setProfile(null);
      setContextLoading(false);
    } else if (
      !isLoadingAuth &&
      isAuthenticated &&
      !isLoadingProfileData &&
      !userProfile
    ) {
      // This case might indicate that the hook ran, finished, but found no profile (e.g., if backend returned nothing or error not caught by isError)
      // Or if the hook was disabled and then enabled but hasn't fetched yet.
      // For safety, ensure loading is false if not actively loading and no profile.
      setContextLoading(false);
      setProfile(null); // Ensure profile is null if no data and not loading
    }
  }, [
    isAuthenticated,
    isLoadingAuth,
    userProfile,
    fetchProfileError,
    isLoadingProfileData,
    isProfileFetchSuccess,
    isProfileFetchError,
    setProfile,
    setContextLoading,
  ]);

  return (
    <nav
      style={{
        background: "var(--color-primary)",
        color: "var(--color-white)",
      }}
      className="p-4 shadow-md"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center space-x-2 text-2xl font-bold group"
          style={{ color: "var(--color-white)" }}
        >
          <CircuitBoard
            size={32}
            strokeWidth={2.2}
            className="transition-transform group-hover:rotate-12"
          />
          <span>Charlotte Job Board</span>
        </Link>
        <div className="flex items-center space-x-4">
          {/* <a href="#" className="px-3 py-2 rounded hover:bg-blue-700">Post a Job</a> */}

          {isLoadingAuth && <p className="px-3 py-2">Loading Auth...</p>}

          {!isLoadingAuth && !isAuthenticated && <LoginButton />}

          {!isLoadingAuth && isAuthenticated && user && (
            <>
              <Link
                to="/jobs/add"
                className="px-3 py-2 rounded transition"
                style={{
                  color: "var(--color-white)",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background =
                    "var(--color-primary-light)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                Post a Job
              </Link>
              <Link
                to="/profile"
                className="px-3 py-2 rounded transition"
                style={{
                  color: "var(--color-white)",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background =
                    "var(--color-primary-light)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                Profile
              </Link>
              {/* Admin Dashboard link only for admins */}
              {userProfile && userProfile.role === "admin" && (
                <Link
                  to="/admin"
                  className="px-3 py-2 rounded transition"
                  style={{
                    color: "var(--color-black)",
                    background: "var(--color-secondary)",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background =
                      "var(--color-primary-light)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background =
                      "var(--color-secondary)")
                  }
                >
                  Admin Dashboard
                </Link>
              )}
              <span className="px-3 py-2">
                Hello, {user.name || user.email}
              </span>
              <LogoutButton />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
