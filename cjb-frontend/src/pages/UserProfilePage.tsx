import React, { useState, useEffect } from "react";
import {
  useUpdateUserProfile,
  type UpdateUserProfilePayload,
} from "../hooks/userProfileHooks"; // Added UpdateUserProfilePayload
import { useUserProfile } from "../context/UserProfileContext";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";

const UserProfilePage: React.FC = () => {
  const {
    mutate: updateUser,
    isPending: isPendingSavingProfile,
    isError: isSaveError,
    error: saveError,
  } = useUpdateUserProfile();
  const { profile, isLoadingProfile } = useUserProfile();
  const { isAuthenticated, isLoading: isLoadingAuth0 } = useAuth0();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  // const [isSaving, setIsSaving] = useState(false); // Replaced by hook's isLoading
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Keep for general errors, or could integrate with hook's error

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setBio(profile.bio || "");
      setProfilePictureUrl(profile.profile_picture_url || "");
    }
  }, [profile, isEditing]);

  if (isLoadingAuth0 || isLoadingProfile) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>
          Could not load your profile. Please try again later or contact
          support.
        </p>
      </div>
    );
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setErrorMessage(null);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null); // Clear previous errors

    const updatedProfileData: UpdateUserProfilePayload = {
      full_name: fullName,
      bio: bio,
      profile_picture_url: profilePictureUrl || undefined, // Match UpdateUserProfilePayload which might expect undefined for nullables
    };

    updateUser(updatedProfileData, {
      onSuccess: () => {
        setIsEditing(false);
        // setProfile is called by Navbar's useFetchUserProfile onSuccess after invalidation
      },
      onError: (err) => {
        if (err instanceof Error) {
          setErrorMessage(
            err.message || "An unexpected error occurred while saving."
          );
        } else {
          setErrorMessage("An unexpected error occurred while saving.");
        }
        console.error("Failed to save profile:", err);
      },
    });
  };

  if (isEditing) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Profile</h1>
        <form
          onSubmit={handleSave}
          className="bg-white shadow-lg rounded-lg p-6"
        >
          {(errorMessage || (isSaveError && saveError)) && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {errorMessage ||
                (saveError instanceof Error
                  ? saveError.message
                  : "Failed to update profile.")}
            </div>
          )}
          <div className="mb-4">
            <label
              htmlFor="fullName"
              className="block text-gray-700 font-semibold mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="bio"
              className="block text-gray-700 font-semibold mb-1"
            >
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="profilePictureUrl"
              className="block text-gray-700 font-semibold mb-1"
            >
              Profile Picture URL
            </label>
            <input
              type="url"
              id="profilePictureUrl"
              value={profilePictureUrl}
              onChange={(e) => setProfilePictureUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.png"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Button
              type="submit"
              disabled={isPendingSavingProfile}
              variant="default"
            >
              {isPendingSavingProfile ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              onClick={handleEditToggle}
              disabled={isPendingSavingProfile}
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>
      {(errorMessage || (isSaveError && saveError)) && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errorMessage ||
            (saveError instanceof Error
              ? saveError.message
              : "Failed to update profile.")}
        </div>
      )}{" "}
      {/* Display error messages in view mode too */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="mb-4">
          <strong className="text-gray-600">Email:</strong>
          <p className="text-gray-800">{profile.email}</p>
        </div>
        <div className="mb-4">
          <strong className="text-gray-600">Full Name:</strong>
          <p className="text-gray-800">{profile.full_name || "Not set"}</p>
        </div>
        <div className="mb-4">
          <strong className="text-gray-600">Bio:</strong>
          <p className="text-gray-800 whitespace-pre-wrap">
            {profile.bio || "Not set"}
          </p>
        </div>
        <div className="mb-4">
          <strong className="text-gray-600">Role:</strong>
          <p className="text-gray-800 capitalize">{profile.role}</p>
        </div>
        {profile.profile_picture_url && (
          <div className="mb-4">
            <strong className="text-gray-600">Profile Picture:</strong>
            <div>
              <img
                src={profile.profile_picture_url}
                alt="Profile"
                className="rounded-full h-32 w-32 object-cover mt-2"
              />
            </div>
          </div>
        )}
        <div className="mt-6 text-sm text-gray-500">
          <p>Joined: {new Date(profile.created_at).toLocaleDateString()}</p>
          <p>
            Last Updated: {new Date(profile.updated_at).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={handleEditToggle}
          className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default UserProfilePage;
