'use client';

import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import FullscreenToggle from './FullscreenToggle';

export default function DefineTaskScreen({ 
  setCurrentScreen, 
  darkMode, 
  setDarkMode, 
  taskDescription, 
  setTaskDescription,
  successCriteria, 
  setSuccessCriteria,
  taskType,
  taskInput,
  selectedTodo,
  onNext
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Add keyboard shortcut listener
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    // Update fullscreen state when it changes outside our control
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleNext = async () => {
    try {
      if (taskType === 'manual') {
        // Create calendar event for manual task
        const event = {
          summary: taskDescription,
          description: taskInput,
          start: {
            dateTime: new Date().toISOString(),
            timeZone: 'America/New_York',
          },
          end: {
            dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            timeZone: 'America/New_York',
          },
        };

        const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('googleCredential')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        });

        if (!response.ok) {
          throw new Error('Failed to create calendar event');
        }
      }

      // Navigate to chunk task screen
      setCurrentScreen('chunkTask');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to proceed. Please try again.');
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-100 text-black'} relative overflow-hidden transition-colors duration-300`}>
      <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between">
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
        <div className="flex items-center space-x-4">
          <FullscreenToggle darkMode={darkMode} />
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </div>
      
      <div className="max-w-xl w-full px-8">
        <h2 className="text-2xl font-medium mb-12 tracking-tight">Define Your Focus</h2>
        
        <label className={`block text-lg font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>One-line task description:</label>
        <textarea 
          className={`w-full p-0 border-0 border-b ${darkMode ? 'border-gray-700 text-white' : 'border-gray-300 text-black'} text-xl font-light mb-12 bg-transparent focus:outline-none focus:border-${darkMode ? 'white' : 'black'} focus:ring-0 h-16 resize-none transition-colors duration-300`}
          placeholder={`What's the one thing you'll focus on right now?`}
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          autoFocus
        />
        
        <label className={`block text-lg font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Success criteria:</label>
        <textarea 
          className={`w-full p-0 border-0 border-b ${darkMode ? 'border-gray-700 text-white' : 'border-gray-300 text-black'} text-xl font-light mb-16 bg-transparent focus:outline-none focus:border-${darkMode ? 'white' : 'black'} focus:ring-0 h-16 resize-none transition-colors duration-300`}
          placeholder="How will you know when this task is complete?"
          value={successCriteria}
          onChange={(e) => setSuccessCriteria(e.target.value)}
        />
        
        <div className="flex justify-end">
          <button 
            onClick={handleNext}
            disabled={isLoading || !taskDescription || !successCriteria}
            className={`px-10 py-4 ${
              darkMode 
                ? 'bg-black' 
                : 'bg-white'
            } rounded-lg text-xl font-medium btn-hover-effect transition-all duration-300
            ${(isLoading || !taskDescription || !successCriteria) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className={`${darkMode ? 'text-glow-white text-white' : 'text-glow-black text-black'}`}>
              {isLoading ? 'Creating...' : 'Next'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}