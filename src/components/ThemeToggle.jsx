'use client';

export default function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <div className="absolute top-6 right-6 z-20">
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className={`w-14 h-7 rounded-full p-1 flex items-center transition-all duration-300
          ${darkMode ? 'bg-black border border-gray-800' : 'bg-gray-300'}`}
      >
        <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300
          ${darkMode ? 'translate-x-7' : 'translate-x-0'}`}></div>
      </button>
    </div>
  );
}