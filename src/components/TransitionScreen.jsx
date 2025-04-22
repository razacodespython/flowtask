import React from 'react';
import ThemeToggle from './ThemeToggle';
import FullscreenToggle from './FullscreenToggle';

export default function TransitionScreen({ setCurrentScreen, darkMode, setDarkMode }) {
  const handleNext = () => {
    setCurrentScreen('pomodoro');
  };

  return (
    <div className={`flex flex-col items-center justify-center h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'} relative transition-colors duration-300`}>
      <div className="absolute top-6 right-6 z-20 flex items-center space-x-4">
        <FullscreenToggle darkMode={darkMode} />
        <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
      
      <div className="flex justify-center items-center">
        <button 
          onClick={handleNext}
          className={`px-12 py-6 ${
            darkMode 
              ? 'bg-black border border-white' 
              : 'bg-white border border-black'
          } rounded-lg text-2xl font-medium transition-all duration-300 hover:scale-105`}
        >
          <span className={`${darkMode ? 'text-white' : 'text-black'}`}>
            Next
          </span>
        </button>
      </div>
    </div>
  );
} 