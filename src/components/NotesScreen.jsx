import React, { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import FullscreenToggle from './FullscreenToggle';

export default function NotesScreen({ 
  setCurrentScreen, 
  darkMode, 
  setDarkMode,
  notes,
  setNotes
}) {
  const handleNext = () => {
    // Save notes to localStorage
    localStorage.setItem('taskNotes', notes);
    // Navigate to pomodoro screen
    setCurrentScreen('pomodoro');
  };

  // Load notes from localStorage if available
  useEffect(() => {
    const savedNotes = localStorage.getItem('taskNotes');
    if (savedNotes && !notes) {
      setNotes(savedNotes);
    }
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-100 text-black'} relative overflow-hidden transition-colors duration-300`}>
      <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between">
        <button 
          onClick={() => setCurrentScreen('chunkTask')}
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
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center space-x-4">
          <FullscreenToggle darkMode={darkMode} />
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </div>
      
      <div className="max-w-xl w-full px-8">
        <h2 className="text-2xl font-medium mb-6 tracking-tight">Notes & Planning</h2>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
          Record your thoughts, ideas, and approach to completing this task.
        </p>
        
        <textarea 
          className={`w-full p-4 rounded-lg border ${
            darkMode 
              ? 'bg-gray-900 border-gray-700 text-white focus:border-blue-500' 
              : 'bg-white border-gray-300 text-black focus:border-blue-600'
          } text-lg mb-10 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none transition-colors duration-300`}
          placeholder="Write down your approach, important points, or any thoughts about this task..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={12}
          autoFocus
        />
        
        <div className="flex justify-end">
          <button 
            onClick={handleNext}
            className={`px-10 py-4 ${
              darkMode 
                ? 'bg-black border border-gray-800' 
                : 'bg-white border border-gray-200'
            } rounded-lg text-xl font-medium btn-hover-effect transition-all duration-300`}
          >
            <span className={`${darkMode ? 'text-glow-white text-white' : 'text-glow-black text-black'}`}>
              Start Working
            </span>
          </button>
        </div>
      </div>
    </div>
  );
} 