'use client';

import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import FullscreenToggle from './FullscreenToggle';

export default function TaskInputScreen({ 
  setCurrentScreen, 
  darkMode, 
  setDarkMode, 
  setTaskDescription,
  setTaskType,
  setTaskInput,
  isLoggedIn,
  setIsLoggedIn
}) {
  const [error, setError] = useState(null);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const credential = localStorage.getItem('googleCredential');
      if (!credential) {
        setCurrentScreen('welcome');
        return;
      }

      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch todos');
      }

      setTodos(data.todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('googleCredential');
    setIsLoggedIn(false);
    setCurrentScreen('welcome');
  };

  const handleTodoSelect = (todo) => {
    setTaskType('google');
    setTaskInput(todo.summary);
    setTaskDescription(todo.summary);
    setCurrentScreen('defineTask');
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'} relative overflow-hidden transition-colors duration-300`}>
      <div className="absolute top-6 right-6 z-20 flex items-center space-x-4">
        <FullscreenToggle darkMode={darkMode} />
        <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>

      {/* Header with home button */}
      <div className="absolute top-6 left-6 z-20">
        <button 
          onClick={() => setCurrentScreen('welcome')}
          className={`px-12 py-5 text-2xl font-semibold transition-all duration-300
            ${darkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'}`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
            <line x1="12" y1="2" x2="12" y2="12" />
          </svg>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="max-w-4xl w-full">
          <h1 className={`text-5xl font-semibold mb-16 text-center tracking-tight ${darkMode ? 'text-white' : 'text-black'}`}>
            Choose your task
          </h1>
          
          <div className="flex flex-row items-start justify-center space-x-12">
            {/* Google Calendar Tasks */}
            <div className="flex-1 max-w-md">
              <h2 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
                From Calendar
              </h2>
              {error ? (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                  <p>{error}</p>
                  <button 
                    onClick={fetchTodos}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : todos.length === 0 ? (
                <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No tasks found for today
                </p>
              ) : (
                <ul className="space-y-3">
                  {todos.map((todo) => (
                    <li 
                      key={todo.id}
                      onClick={() => handleTodoSelect(todo)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        darkMode 
                          ? 'bg-gray-800 hover:bg-gray-700' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium">{todo.summary}</div>
                      {todo.description && (
                        <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {todo.description}
                        </div>
                      )}
                      <div className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {new Date(todo.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Create New Task button */}
            <div className="flex-1 max-w-md">
              <button 
                onClick={() => {
                  setTaskType('manual');
                  setTaskInput('');
                  setTaskDescription('');
                  setCurrentScreen('defineTask');
                }}
                className={`w-full px-12 py-5 text-2xl font-semibold transition-all duration-300 relative
                  ${darkMode ? 'text-white hover:border-opacity-50' : 'text-black hover:border-opacity-50'}`}
              >
                <span>Create Task</span>
                <div className={`absolute bottom-0 left-0 h-0.5 border-b-2 ${darkMode ? 'border-white' : 'border-black'} button-line opacity-30`}></div>
                <div className={`absolute bottom-0 left-0 h-0.5 border-b-2 ${darkMode ? 'border-white' : 'border-black'} button-line-hover`}></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sign out button in bottom right */}
      <div className="absolute bottom-6 right-6 z-20">
        <button
          onClick={handleLogout}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
            ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
        >
          Sign Out
        </button>
      </div>

      <style jsx>{`
        .button-line {
          width: 100%;
          transition: opacity 0.3s ease-out;
        }

        .button-line-hover {
          width: 0;
          transition: width 0.3s ease-out;
        }

        button:hover .button-line-hover {
          width: 100%;
        }
      `}</style>
    </div>
  );
} 