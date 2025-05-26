
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppLayout } from './components/AppLayout';
import { Dashboard } from './components/Dashboard';
import { ProfileSetup } from './components/ProfileSetup';
import { Members } from './components/Members';
import { Jobs } from './components/Jobs';
import { Endorsements } from './components/Endorsements';

// Create a client
const queryClient = new QueryClient();

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
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/setup" element={<ProfileSetup />} />
              <Route path="/*" element={<AppLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="members" element={<Members />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="endorsements" element={<Endorsements />} />
              </Route>
            </Routes>
          </SignedIn>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;