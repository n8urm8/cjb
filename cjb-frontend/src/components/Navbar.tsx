import React from 'react';
import { Link } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './auth/LoginButton';
import LogoutButton from './auth/LogoutButton';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth0();

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Charlotte Job Board
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="px-3 py-2 rounded hover:bg-blue-700">Home</Link>
          {/* <a href="#" className="px-3 py-2 rounded hover:bg-blue-700">Post a Job</a> */}
          
          {isLoading && <p className="px-3 py-2">Loading...</p>}
          
          {!isLoading && !isAuthenticated && (
            <LoginButton />
          )}
          
          {!isLoading && isAuthenticated && user && (
            <>
              <span className="px-3 py-2">Hello, {user.name || user.email}</span>
              <LogoutButton />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
