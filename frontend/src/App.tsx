
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppLayout } from './components/AppLayout';
import { Dashboard } from './components/Dashboard';
import { ProfileSetupNew } from './components/ProfileSetupNew';
import { MembersNew } from './components/MembersNew';
import { JobsNew } from './components/JobsNew';
import { JobPost } from './components/JobPost';
import { EndorsementsNew } from './components/EndorsementsNew';
import { UserProfile } from './components/UserProfile';
import { useApiClient } from './lib/api';

// Create a client
const queryClient = new QueryClient();

// Component to initialize API client when signed in
function AuthenticatedApp() {
  // This sets up the auth interceptor for all API calls
  useApiClient();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/setup" element={<ProfileSetupNew />} />
      <Route path="/*" element={<AppLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="members" element={<MembersNew />} />
        <Route path="profile/:userId" element={<UserProfile />} />
        <Route path="jobs" element={<JobsNew />} />
        <Route path="jobs/new" element={<JobPost />} />
        <Route path="endorsements" element={<EndorsementsNew />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <SignedOut>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">SkillConnect</h1>
                <p className="text-gray-600 mb-8 max-w-md">
                  Connect with skilled professionals, showcase your expertise, and find opportunities.
                </p>
                <SignInButton mode="modal">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Sign In to Get Started
                  </button>
                </SignInButton>
              </div>
            </div>
          </SignedOut>

          <SignedIn>
            <AuthenticatedApp />
          </SignedIn>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;