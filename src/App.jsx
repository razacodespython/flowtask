import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import TaskInputScreen from './components/TaskInputScreen';
import BreatheScreen from './components/BreatheScreen';
import DefineTaskScreen from './components/DefineTaskScreen';
import ChunkTaskScreen from './components/ChunkTaskScreen';
import PomodoroScreen from './components/PomodoroScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [darkMode, setDarkMode] = useState(false);
  const [taskDescription, setTaskDescription] = useState('');
  const [taskType, setTaskType] = useState('');
  const [taskInput, setTaskInput] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [step1, setStep1] = useState('');
  const [step2, setStep2] = useState('');
  const [step3, setStep3] = useState('');

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
      {currentScreen === 'welcome' && (
        <WelcomeScreen 
          setCurrentScreen={setCurrentScreen} 
          darkMode={darkMode} 
          setDarkMode={setDarkMode}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
      {currentScreen === 'taskInput' && (
        <TaskInputScreen 
          setCurrentScreen={setCurrentScreen} 
          darkMode={darkMode} 
          setDarkMode={setDarkMode}
          setTaskDescription={setTaskDescription}
          setTaskType={setTaskType}
          setTaskInput={setTaskInput}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
      {currentScreen === 'defineTask' && (
        <DefineTaskScreen 
          setCurrentScreen={setCurrentScreen} 
          darkMode={darkMode} 
          setDarkMode={setDarkMode}
          taskDescription={taskDescription}
          setTaskDescription={setTaskDescription}
          taskType={taskType}
          taskInput={taskInput}
        />
      )}
      {currentScreen === 'chunkTask' && (
        <ChunkTaskScreen 
          setCurrentScreen={setCurrentScreen} 
          darkMode={darkMode} 
          setDarkMode={setDarkMode}
          step1={step1}
          setStep1={setStep1}
          step2={step2}
          setStep2={setStep2}
          step3={step3}
          setStep3={setStep3}
        />
      )}
      {currentScreen === 'pomodoro' && (
        <PomodoroScreen 
          setCurrentScreen={setCurrentScreen} 
          darkMode={darkMode} 
          setDarkMode={setDarkMode}
        />
      )}
      {currentScreen === 'breathe' && (
        <BreatheScreen 
          setCurrentScreen={setCurrentScreen} 
          darkMode={darkMode} 
          setDarkMode={setDarkMode}
        />
      )}
    </div>
  );
}

export default App; 