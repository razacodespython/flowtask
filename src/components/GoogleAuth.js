import { useState } from 'react';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';

export default function GoogleAuth({ onLogin, onTodosFetched, onTodoSelect }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
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
      setError(null); // Clear any previous errors
      
      console.log('Login successful, token details:', {
        access_token: tokenResponse.access_token ? 'present' : 'missing',
        scope: tokenResponse.scope,
        token_type: tokenResponse.token_type,
        expires_in: tokenResponse.expires_in
      });
      
      // Store the credential for later use
      if (tokenResponse.access_token) {
        localStorage.setItem('googleCredential', tokenResponse.access_token);
        console.log('Access token stored successfully');
      } else {
        console.error('No access token in response:', tokenResponse);
        throw new Error('No access token received from Google');
      }
      
      setIsLoggedIn(true);
      onLogin(true);
      
      console.log('Fetching todos...');
      
      // Fetch todos from our API route
      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: tokenResponse.access_token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to fetch todos');
      }

      console.log('Todos fetched:', data.todos);
      setTodos(data.todos);
      onTodosFetched(data.todos);
    } catch (error) {
      console.error('Error during Google login:', error);
      setError(error.message);
      setIsLoggedIn(false);
      onLogin(false);
      // Clear the invalid token
      localStorage.removeItem('googleCredential');
    } finally {
      setIsLoading(false);
    }
  }

  function handleLoginError(error) {
    console.error('Login Failed:', error);
    setError('Failed to log in with Google. Please try again.');
    setIsLoggedIn(false);
    onLogin(false);
    // Clear any existing token
    localStorage.removeItem('googleCredential');
  }

  const handleTodoSelect = (todo) => {
    setSelectedTodo(todo);
    onTodoSelect(todo);
  };

  const handleRetry = () => {
    setError(null);
    setIsLoggedIn(false);
    // Clear any existing token
    localStorage.removeItem('googleCredential');
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
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
      
      {!isLoggedIn && !error ? (
        <button
          onClick={() => login()}
          disabled={isLoading}
          className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      ) : isLoggedIn && !error ? (
        <div className="text-center w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Your Todo Items</h2>
          {todos.length === 0 ? (
            <p className="text-gray-600">No todo items found for today</p>
          ) : (
            <ul className="space-y-2">
              {todos.map((todo) => (
                <li 
                  key={todo.id} 
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedTodo?.id === todo.id 
                      ? 'bg-blue-100 border-2 border-blue-500' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => handleTodoSelect(todo)}
                >
                  <div className="font-semibold">{todo.summary}</div>
                  {todo.description && (
                    <div className="text-sm text-gray-600 mt-1">{todo.description}</div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(todo.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
} 