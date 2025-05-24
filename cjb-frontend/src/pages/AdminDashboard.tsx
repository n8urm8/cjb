import React, { useState } from "react";
import {
  useFetchAllUserProfiles,
  useUpdateUserProfileAdmin,
  type AdminUpdateUserProfilePayload,
} from "../hooks/userProfileHooks";

export default function AdminDashboard() {
  const {
    data: users,
    isLoading,
    isError,
    refetch,
  } = useFetchAllUserProfiles();
  const updateUserProfile = useUpdateUserProfileAdmin();
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<
    Partial<AdminUpdateUserProfilePayload>
  >({});

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error loading users.</div>;

  const handleEdit = (user: AdminUpdateUserProfilePayload) => {
    setEditUserId(user.user_id);
    setEditForm({ ...user });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (editUserId) {
      updateUserProfile.mutate(
        { user_id: editUserId, ...editForm },
        {
          onSuccess: () => {
            setEditUserId(null);
            refetch();
          },
        }
      );
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Full Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.user_id}>
              <td>
                {editUserId === user.user_id ? (
                  <input
                    name="email"
                    value={editForm.email || ""}
                    onChange={handleChange}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editUserId === user.user_id ? (
                  <input
                    name="full_name"
                    value={editForm.full_name || ""}
                    onChange={handleChange}
                  />
                ) : (
                  user.full_name
                )}
              </td>
              <td>
                {editUserId === user.user_id ? (
                  <input
                    name="role"
                    value={editForm.role || ""}
                    onChange={handleChange}
                  />
                ) : (
                  user.role
                )}
              </td>
              <td>
                {editUserId === user.user_id ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={updateUserProfile.isPending}
                    >
                      Save
                    </button>
                    <button onClick={() => setEditUserId(null)}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(user)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
