import React from 'react';
import { useApp } from '../context/AppContext';
import { LoginPage } from './LoginPage';
import { Search } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Front Auth Guard:
 * When user opens the site, only the login screen is displayed if not authenticated.
 * Includes a smooth loading spinner to prevent layout flashing during session check.
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { currentUser, isAuthLoading } = useApp();

  // Show a clean warm spinner during session check
  if (isAuthLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FFF9D6] text-[#3D3200]">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-[#FDE047] border-t-[#D97706] animate-spin" />
          <div className="absolute w-8 h-8 rounded-full bg-[#FFD84D] flex items-center justify-center shadow-xs">
            <Search className="w-4 h-4 text-[#3D3200]" />
          </div>
        </div>
        <p className="mt-4 text-xs font-bold text-[#4D3F00] tracking-wide">
          Verifying campus session...
        </p>
      </div>
    );
  }

  // Not logged in -> Show ONLY the login screen
  if (!currentUser) {
    return <LoginPage />;
  }

  // Logged in -> Render full application
  return <>{children}</>;
};
