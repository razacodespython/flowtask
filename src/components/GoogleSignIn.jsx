'use client';

import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

export default function GoogleSignIn({ onLogin }) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: handleLoginError,
    scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.events.readonly',
    flow: 'implicit',
    onNonOAuthError: (error) => {
      console.error('Non-OAuth error:', error);
      setError('Failed to initialize Google login');
    }
  });

  async function handleLoginSuccess(tokenResponse) {
    try {
      setIsLoading(true);
      setError(null);
      
      if (tokenResponse.access_token) {
        onLogin(tokenResponse);
      } else {
        throw new Error('No access token received from Google');
      }
    } catch (error) {
      console.error('Error during Google login:', error);
      setError(error.message);
      localStorage.removeItem('googleCredential');
    } finally {
      setIsLoading(false);
    }
  }

  function handleLoginError(error) {
    console.error('Login Failed:', error);
    setError('Failed to log in with Google. Please try again.');
    localStorage.removeItem('googleCredential');
  }

  const handleRetry = () => {
    setError(null);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          <p className="font-semibold">Error: {error}</p>
          <button 
            onClick={handleRetry}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      
      <button
        onClick={() => login()}
        disabled={isLoading}
        className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Signing in...' : 'Sign in with Google'}
      </button>
    </div>
  );
} 