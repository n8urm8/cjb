import React, { useState } from "react";
import {
  useFetchAllUserProfiles,
  useUpdateUserProfileAdmin,
  type AdminUpdateUserProfilePayload,
} from "../hooks/userProfileHooks";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "../components/ui/table";

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
    <div className="min-h-screen py-10 px-2 flex justify-center items-start" style={{ background: "linear-gradient(135deg, var(--color-white) 0%, var(--color-primary-light) 100%)" }}>
      <div className="w-full max-w-4xl rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-10" style={{ background: "var(--color-white)" }}>
        {/* Header Bar */}
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex items-center justify-center rounded-full w-10 h-10 shadow-sm" style={{ background: "var(--color-secondary)", color: "var(--color-black)" }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 9V7a5 5 0 1110 0v2m-1 4v2a3 3 0 11-6 0v-2" /></svg>
          </span>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--color-primary)" }}>Admin Dashboard</h1>
        </div>
        <div className="border-b border-gray-100 mb-6"></div>
        {/* Table Card */}
        <div className="overflow-x-auto rounded-xl" style={{ background: "var(--color-white)" }}>
          <Table>
            <TableCaption className="text-base mb-2 mt-4" style={{ color: "var(--color-primary)" }}>Manage user profiles (edit email, full name, or role)</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-base" style={{ color: "var(--color-primary)" }}>Email</TableHead>
                <TableHead className="text-base" style={{ color: "var(--color-primary)" }}>Full Name</TableHead>
                <TableHead className="text-base" style={{ color: "var(--color-primary)" }}>Role</TableHead>
                <TableHead className="text-base" style={{ color: "var(--color-primary)" }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>
                    {editUserId === user.user_id ? (
                      <input
                        name="email"
                        value={editForm.email || ""}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-full focus:ring-2 transition"
                        style={{ borderColor: "var(--color-primary-light)", outlineColor: "var(--color-primary-light)" }}
                      />
                    ) : (
                      <span style={{ color: "var(--color-black)" }}>{user.email}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editUserId === user.user_id ? (
                      <input
                        name="full_name"
                        value={editForm.full_name || ""}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-full focus:ring-2 transition"
                        style={{ borderColor: "var(--color-primary-light)", outlineColor: "var(--color-primary-light)" }}
                      />
                    ) : (
                      <span style={{ color: "var(--color-black)" }}>{user.full_name}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editUserId === user.user_id ? (
                      <input
                        name="role"
                        value={editForm.role || ""}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-full focus:ring-2 transition"
                        style={{ borderColor: "var(--color-primary-light)", outlineColor: "var(--color-primary-light)" }}
                      />
                    ) : (
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold border" style={{ background: "var(--color-secondary)", color: "var(--color-black)", borderColor: "var(--color-secondary)" }}>{user.role}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {editUserId === user.user_id ? (
                        <>
                          <button
                            onClick={handleSave}
                            disabled={updateUserProfile.isPending}
                            className="px-3 py-1 rounded transition"
                            style={{ background: "var(--color-primary)", color: "var(--color-white)" }}
                            onMouseOver={e => (e.currentTarget.style.background = 'var(--color-primary-light)')}
                            onMouseOut={e => (e.currentTarget.style.background = 'var(--color-primary)')}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditUserId(null)}
                            className="px-3 py-1 rounded transition"
                            style={{ background: "var(--color-secondary)", color: "var(--color-black)" }}
                            onMouseOver={e => (e.currentTarget.style.background = 'var(--color-primary-light)')}
                            onMouseOut={e => (e.currentTarget.style.background = 'var(--color-secondary)')}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEdit(user)}
                          className="px-3 py-1 rounded transition"
                          style={{ background: "var(--color-primary)", color: "var(--color-white)" }}
                          onMouseOver={e => (e.currentTarget.style.background = 'var(--color-primary-light)')}
                          onMouseOut={e => (e.currentTarget.style.background = 'var(--color-primary)')}
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
