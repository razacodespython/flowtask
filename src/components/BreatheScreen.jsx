'use client';

import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import FullscreenToggle from './FullscreenToggle';

export default function BreatheScreen({ setCurrentScreen, darkMode, setDarkMode }) {
  const [phase, setPhase] = useState('inhale');
  const [count, setCount] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  const [message, setMessage] = useState('Clear your mind');
  
  // Reduced number of messages for fewer rounds
  const flowMessages = [
    'Clear your mind',
    'Focus on your breath',
    'Enter the flow state'
  ];
  
  // Simulate breathing guidance
  useEffect(() => {
    const breathingInterval = setInterval(() => {
      if (phase === 'inhale') {
        if (count > 1) {
          setCount(count - 1);
        } else {
          setPhase('hold');
          setCount(4);
        }
      } else if (phase === 'hold') {
        if (count > 1) {
          setCount(count - 1);
        } else {
          setPhase('exhale');
          setCount(6);
        }
      } else if (phase === 'exhale') {
        if (count > 1) {
          setCount(count - 1);
        } else {
          setPhase('inhale');
          setCount(4);
          setCycleCount(cycleCount + 1);
          // Change guidance message every cycle
          if (cycleCount < flowMessages.length - 1) {
            setMessage(flowMessages[cycleCount + 1]);
          }
        }
      }
    }, 1000);
    
    return () => clearInterval(breathingInterval);
  }, [phase, count, cycleCount]);
  
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'} relative overflow-hidden transition-colors duration-300`}>
      <div className="absolute top-6 right-6 z-20 flex items-center space-x-4">
        <FullscreenToggle darkMode={darkMode} />
        <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
      
      {/* Header with theme toggle and home button */}
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
      </div>
      
      {/* Background subtle animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-full ${darkMode ? 'bg-black' : 'bg-gradient-to-r from-gray-100 to-white'} opacity-50 ${phase === 'inhale' ? 'scale-105' : 'scale-100'} transition-all duration-3000`}></div>
      </div>
      
      {/* Central breathing circle */}
      <div className={`relative w-64 h-64 mb-16 transition-all duration-${phase === 'hold' ? '500' : '3000'} ease-in-out flex items-center justify-center
                      ${phase === 'inhale' ? 'scale-110' : phase === 'exhale' ? 'scale-90' : 'scale-100'}`}>
        <div className={`absolute w-64 h-64 rounded-full border ${darkMode ? 'border-gray-700' : 'border-gray-300'} opacity-30 ${phase === 'inhale' ? 'scale-90' : phase === 'exhale' ? 'scale-110' : 'scale-100'} transition-all duration-3000`}></div>
        <div className={`absolute w-64 h-64 rounded-full border ${darkMode ? 'border-gray-700' : 'border-gray-300'} opacity-20 ${phase === 'inhale' ? 'scale-80' : phase === 'exhale' ? 'scale-120' : 'scale-100'} transition-all duration-3000`}></div>
        <div className={`absolute w-64 h-64 rounded-full border ${darkMode ? 'border-gray-700' : 'border-gray-300'} opacity-10 ${phase === 'inhale' ? 'scale-70' : phase === 'exhale' ? 'scale-130' : 'scale-100'} transition-all duration-3000`}></div>
        
        <div className={`w-48 h-48 rounded-full ${darkMode ? 'bg-black border border-gray-800' : 'bg-white shadow-lg'} flex items-center justify-center z-10 ${darkMode ? 'shadow-2xl' : ''}`}>
          <div className="text-center">
            <div className={`text-3xl font-light mb-2 ${darkMode ? '' : 'text-gray-800'}`}>
              {phase === 'inhale' ? 'Inhale' : phase === 'hold' ? 'Hold' : 'Exhale'}
            </div>
            <div className={`text-4xl font-extralight ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{count}</div>
          </div>
        </div>
      </div>
      
      {/* Flow state message */}
      <div className={`text-2xl font-light mb-16 tracking-wide text-center max-w-md px-6 ${darkMode ? '' : 'text-gray-800'}`}>
        {message}
      </div>
      
      {/* Progress dots */}
      <div className="flex space-x-2 mb-12">
        {flowMessages.map((_, index) => (
          <div 
            key={index} 
            className={`w-2 h-2 rounded-full ${index <= cycleCount 
              ? (darkMode ? 'bg-white' : 'bg-gray-800') 
              : (darkMode ? 'bg-gray-800' : 'bg-gray-300')} transition-all duration-500`}
          ></div>
        ))}
      </div>
      
      {/* Button appears more prominent after 1-2 cycles */}
      <button 
        onClick={() => setCurrentScreen('defineTask')}
        className={`px-10 py-4 ${
          darkMode 
            ? 'bg-black' 
            : 'bg-white'
        } rounded-lg text-xl font-medium btn-hover-effect transition-all duration-300
        ${cycleCount >= 1 ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4'} transition-all duration-500`}
      >
        <span className={`${darkMode ? 'text-glow-white text-white' : 'text-glow-black text-black'}`}>
          I'm Ready
        </span>
      </button>
      
      {/* Skip option */}
      <button 
        onClick={() => setCurrentScreen('defineTask')} 
        className="text-gray-500 text-sm mt-4 hover:text-gray-300 transition-colors"
      >
        Skip
      </button>
    </div>
  );
}