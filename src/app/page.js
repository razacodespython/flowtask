'use client';

import { useState, useEffect } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import TaskInputScreen from '@/components/TaskInputScreen';
import BreatheScreen from '@/components/BreatheScreen';
import DefineTaskScreen from '@/components/DefineTaskScreen';
import ChunkTaskScreen from '@/components/ChunkTaskScreen';
import PomodoroScreen from '@/components/PomodoroScreen';
import CompletionScreen from '@/components/CompletionScreen';
import GoogleAuth from '@/components/GoogleAuth';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [darkMode, setDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  
  // Simple flat state variables instead of a nested structure
  const [taskDescription, setTaskDescription] = useState('');
  const [taskType, setTaskType] = useState('');
  const [taskInput, setTaskInput] = useState('');
  const [successCriteria, setSuccessCriteria] = useState('');
  const [step1, setStep1] = useState('');
  const [step2, setStep2] = useState('');
  const [step3, setStep3] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Load dark mode preference from localStorage on first render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        setDarkMode(savedMode === 'true');
      }
    }
  }, []);

  // Save dark mode preference to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', darkMode);
    }
  }, [darkMode]);

  const handleTodoSelect = (todo) => {
    setSelectedTodo(todo);
    setTaskDescription(todo.summary);
    setCurrentScreen('breathe');
  };

  const handleTaskComplete = async () => {
    if (selectedTodo) {
      try {
        const credential = localStorage.getItem('googleCredential');
        const response = await fetch('/api/calendar/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            credential,
            eventId: selectedTodo.id
          }),
        });

        if (!response.ok) {
          console.error('Failed to mark todo as complete');
        }
      } catch (error) {
        console.error('Error marking todo as complete:', error);
      }
    }
  };

  // Render the current screen
  const renderScreen = () => {
    const props = {
      setCurrentScreen,
      darkMode,
      setDarkMode,
      taskDescription,
      setTaskDescription,
      taskType,
      setTaskType,
      taskInput,
      setTaskInput,
      successCriteria, 
      setSuccessCriteria,
      step1,
      setStep1,
      step2,
      setStep2,
      step3,
      setStep3,
      currentStepIndex,
      setCurrentStepIndex,
      todos,
      selectedTodo,
      setSelectedTodo
    };

    switch(currentScreen) {
      case 'welcome':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <WelcomeScreen 
              {...props} 
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          </div>
        );
      case 'taskInput':
        return <TaskInputScreen 
          {...props} 
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />;
      // case 'breathe':
      //   return <BreatheScreen {...props} />;
      case 'defineTask':
        return <DefineTaskScreen 
          {...props} 
          onNext={(taskData) => {
            setTaskDescription(taskData.description);
            setCurrentScreen('chunkTask');
          }}
        />;
      case 'chunkTask':
        return <ChunkTaskScreen {...props} />;
      case 'pomodoro':
        return <PomodoroScreen {...props} />;
      case 'completion':
        return <CompletionScreen {...props} onComplete={handleTaskComplete} />;
      default:
        return <WelcomeScreen {...props} />;
    }
  };

  return (
    <main className={`h-screen ${darkMode ? 'bg-black' : 'bg-gray-100'} overflow-hidden font-sans transition-colors duration-300`}>
      {renderScreen()}
    </main>
  );
}