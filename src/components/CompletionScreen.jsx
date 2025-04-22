'use client';

import ThemeToggle from './ThemeToggle';

export default function CompletionScreen({ 
  setCurrentScreen, 
  darkMode, 
  setDarkMode,
  setTaskDescription,
  setSuccessCriteria,
  setStep1,
  setStep2,
  setStep3,
  setCurrentStepIndex,
  onComplete
}) {
  // Function to reset all task data
  const resetTaskData = () => {
    setTaskDescription('');
    setSuccessCriteria('');
    setStep1('');
    setStep2('');
    setStep3('');
    setCurrentStepIndex(0);
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Create private calendar event if user is logged in
      const accessToken = localStorage.getItem('googleCredential');
      if (accessToken) {
        try {
          const calendarResponse = await fetch('/api/calendar/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              summary: taskDescription,
              description: `Success Criteria: ${successCriteria}\nSteps:\n1. ${step1}\n2. ${step2}\n3. ${step3}`,
              visibility: 'private',
              accessToken
            }),
          });

          if (!calendarResponse.ok) {
            const errorData = await calendarResponse.json();
            console.error('Error creating calendar event:', errorData);
          }
        } catch (error) {
          console.error('Error creating calendar event:', error);
        }
      }
      
      // Create task
      const taskResponse = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskDescription,
          description: `Success Criteria: ${successCriteria}\nSteps:\n1. ${step1}\n2. ${step2}\n3. ${step3}`,
          dueDate: new Date().toISOString(),
          priority: 'medium',
          status: 'completed',
          type: 'manual'
        }),
      });

      if (!taskResponse.ok) {
        const errorData = await taskResponse.json();
        console.error('Error creating task:', errorData);
      }

      // Call the onComplete callback
      onComplete();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-100 text-black'} transition-colors duration-300`}>
      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div className="max-w-md w-full px-8 flex flex-col items-center">
        <div className="text-2xl font-medium mb-8 text-center">Task Completed</div>
        <div className="text-6xl mb-20">✓</div>
        
        <div className="flex space-x-4 w-full">
          <button 
            onClick={() => {
              resetTaskData();
              setCurrentScreen('welcome');
            }}
            className={`flex-1 px-8 py-4 ${darkMode ? 'bg-black' : 'bg-gray-100'} rounded-lg text-xl font-medium btn-hover-effect transition-all duration-300`}
          >
            <span className={`${darkMode ? 'text-glow-white text-white' : 'text-glow-black text-black'}`}>
              End Session
            </span>
          </button>
          <button 
            onClick={() => {
              handleComplete();
              resetTaskData();
              setCurrentScreen('defineTask');
            }}
            className={`flex-1 px-8 py-4 ${darkMode ? 'bg-black' : 'bg-white'} rounded-lg text-xl font-medium btn-hover-effect transition-all duration-300`}
          >
            <span className={`${darkMode ? 'text-glow-white text-white' : 'text-glow-black text-black'}`}>
              Next Task
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}