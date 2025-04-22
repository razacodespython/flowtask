'use client';

import ThemeToggle from './ThemeToggle';

export default function ChunkTaskScreen({ 
  setCurrentScreen, 
  darkMode, 
  setDarkMode, 
  step1, 
  setStep1,
  step2, 
  setStep2,
  step3, 
  setStep3
}) {
  const handleNext = () => {
    setCurrentScreen('notes');
  };

  return (
    <div className={`flex flex-col items-center justify-center h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-100 text-black'} relative overflow-hidden transition-colors duration-300`}>
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
        <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
      
      <div className="max-w-md w-full px-8">
        <h2 className="text-2xl font-medium mb-6 tracking-tight">Break Down Your Task</h2>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>Divide your work into clear, actionable steps</p>
        
        {/* Step 1 */}
        <div className="flex items-start mb-12">
          <div className="mr-6 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full border-2 ${darkMode ? 'border-white' : 'border-black'} flex items-center justify-center`}>
              1
            </div>
            <div className={`w-px h-12 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} mt-2`}></div>
          </div>
          <input 
            type="text"
            className={`flex-grow p-0 border-0 border-b ${
              darkMode ? 'border-gray-700 text-white' : 'border-gray-300 text-black'
            } text-xl font-light bg-transparent focus:outline-none focus:border-${
              darkMode ? 'white' : 'black'
            } focus:ring-0 transition-colors duration-300`}
            placeholder="Step 1"
            value={step1}
            onChange={(e) => setStep1(e.target.value)}
          />
        </div>
        
        {/* Step 2 */}
        <div className="flex items-start mb-12">
          <div className="mr-6 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full border ${darkMode ? 'border-gray-700' : 'border-gray-400'} flex items-center justify-center`}>
              2
            </div>
            <div className={`w-px h-12 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} mt-2`}></div>
          </div>
          <input 
            type="text"
            className={`flex-grow p-0 border-0 border-b ${
              darkMode ? 'border-gray-700 text-white' : 'border-gray-300 text-black'
            } text-xl font-light bg-transparent focus:outline-none focus:border-${
              darkMode ? 'white' : 'black'
            } focus:ring-0 transition-colors duration-300`}
            placeholder="Step 2"
            value={step2}
            onChange={(e) => setStep2(e.target.value)}
          />
        </div>
        
        {/* Step 3 */}
        <div className="flex items-start mb-12">
          <div className="mr-6 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full border ${darkMode ? 'border-gray-700' : 'border-gray-400'} flex items-center justify-center`}>
              3
            </div>
          </div>
          <input 
            type="text"
            className={`flex-grow p-0 border-0 border-b ${
              darkMode ? 'border-gray-700 text-white' : 'border-gray-300 text-black'
            } text-xl font-light bg-transparent focus:outline-none focus:border-${
              darkMode ? 'white' : 'black'
            } focus:ring-0 transition-colors duration-300`}
            placeholder="Step 3"
            value={step3}
            onChange={(e) => setStep3(e.target.value)}
          />
        </div>
        
        <div className="flex justify-end mt-16">
          <button 
            onClick={handleNext}
            className={`px-10 py-4 ${
              darkMode 
                ? 'bg-black' 
                : 'bg-white'
            } rounded-lg text-xl font-medium btn-hover-effect transition-all duration-300`}
          >
            <span className={`${darkMode ? 'text-glow-white text-white' : 'text-glow-black text-black'}`}>
              Next
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}