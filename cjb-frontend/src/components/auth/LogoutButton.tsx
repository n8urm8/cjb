import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@/components/ui/button'; // Using shadcn/ui button

const LogoutButton: React.FC = () => {
  const { logout } = useAuth0();

  return (
    <Button 
      variant="outline" 
      onClick={() => 
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      Log Out
    </Button>
  );
};

export default LogoutButton;
