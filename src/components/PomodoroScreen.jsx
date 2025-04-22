'use client';

import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

export default function PomodoroScreen({ 
  setCurrentScreen,
  darkMode, 
  setDarkMode, 
  taskDescription,
  step1,
  step2,
  step3,
  currentStepIndex,
  setCurrentStepIndex
}) {
  const [minutes, setMinutes] = useState(24);
  const [seconds, setSeconds] = useState(37);
  const [isRunning, setIsRunning] = useState(true);

  // Get steps in an array
  const steps = [step1, step2, step3].filter(step => step.trim() !== '');
  
  // Get current step text
  const currentStep = steps[currentStepIndex] || taskDescription || "Complete your task";

  // Handle timer
  useEffect(() => {
    let interval;
    
    if (isRunning) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else {
          if (minutes === 0) {
            clearInterval(interval);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const completeStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setCurrentScreen('completion');
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-100 text-black'} transition-colors duration-300`}>
      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div className="text-8xl font-extralight mb-24">{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</div>
      
      <div className={`w-16 h-1 ${darkMode ? 'bg-white' : 'bg-black'} mb-12`}></div>
      
      <div className="text-xl font-light mb-24 text-center max-w-xs">
        {currentStep}
      </div>
      
      <div className="flex space-x-8">
        <button 
          onClick={toggleTimer}
          className={`px-8 py-4 ${darkMode ? 'bg-black' : 'bg-white'} rounded-lg text-xl font-medium btn-hover-effect transition-all duration-300`}
        >
          <span className={`${darkMode ? 'text-glow-white text-white' : 'text-glow-black text-black'}`}>
            {isRunning ? 'Pause' : 'Resume'}
          </span>
        </button>
        <button 
          onClick={completeStep}
          className={`px-8 py-4 ${darkMode ? 'bg-black' : 'bg-white'} rounded-lg text-xl font-medium btn-hover-effect transition-all duration-300`}
        >
          <span className={`${darkMode ? 'text-glow-white text-white' : 'text-glow-black text-black'}`}>
            Complete
          </span>
        </button>
      </div>
    </div>
  );
}