import React, { createContext, useState, useContext, type ReactNode } from 'react';

// Matches the backend UserProfile schema
export interface BackendUserProfile {
  id: number;
  user_id: string;
  email: string;
  full_name?: string | null;
  profile_picture_url?: string | null;
  bio?: string | null;
  role: string; // 'user' or 'admin'
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

interface UserProfileContextType {
  profile: BackendUserProfile | null;
  setProfile: (profile: BackendUserProfile | null) => void;
  isLoadingProfile: boolean; 
  setIsLoadingProfile: (loading: boolean) => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<BackendUserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);

  return (
    <UserProfileContext.Provider value={{ profile, setProfile, isLoadingProfile, setIsLoadingProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
