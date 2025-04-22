'use client';

import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import FullscreenToggle from './FullscreenToggle';

export default function TransitionScreen({ 
  setCurrentScreen, 
  darkMode, 
  setDarkMode,
  step1,
  step2,
  step3
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentScreen('pomodoro');
    }, 800);
  };

  return (
    <div className={`flex flex-col items-center justify-center h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-100 text-black'} relative transition-colors duration-300`}>
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
      
      <div className={`max-w-md mx-auto text-center ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'} transition-all duration-700`}>
        <h2 className="text-3xl font-medium mb-12">Ready to Focus</h2>
        
        <div className="relative w-64 h-64 mx-auto mb-16">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`absolute inset-0 rounded-full border ${
                darkMode ? 'border-white' : 'border-black'
              } pulse-circle`}
              style={{
                opacity: 0.1 - (i * 0.03),
                animationDelay: `${i * 0.5}s`,
                transform: `scale(${1 - (i * 0.2)})`
              }}
            />
          ))}
          
          {/* Inner circle */}
          <div className={`absolute inset-0 flex items-center justify-center`}>
            <div className={`w-32 h-32 rounded-full ${darkMode ? 'bg-black border border-gray-800' : 'bg-white shadow-lg'} flex items-center justify-center`}>
              <svg 
                className="w-12 h-12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke={darkMode ? "white" : "black"} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Steps summary */}
        <div className={`mb-16 text-left bg-${darkMode ? 'gray-900' : 'white'} p-6 rounded-lg shadow-lg`}>
          <h3 className="font-medium mb-4">Your Steps:</h3>
          <ul className="space-y-2">
            {step1 && <li className="flex items-start">
              <span className="mr-2">1.</span>
              <span>{step1}</span>
            </li>}
            {step2 && <li className="flex items-start">
              <span className="mr-2">2.</span>
              <span>{step2}</span>
            </li>}
            {step3 && <li className="flex items-start">
              <span className="mr-2">3.</span>
              <span>{step3}</span>
            </li>}
          </ul>
        </div>
        
        <button 
          onClick={handleNext}
          className={`px-12 py-5 ${
            darkMode 
              ? 'bg-black' 
              : 'bg-white'
          } rounded-lg text-xl font-medium btn-hover-effect transition-all duration-300`}
        >
          <span className={`${darkMode ? 'text-glow-white text-white' : 'text-glow-black text-black'}`}>
            Start Now
          </span>
        </button>
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.3;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.1;
          }
        }
        
        .pulse-circle {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}