import React from 'react';
import { motion } from 'framer-motion';

function BreatheScreen({ setCurrentScreen, darkMode, setDarkMode, taskDescription, taskType, taskInput }) {
  const handleComplete = () => {
    setCurrentScreen('define-task');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Breathe</h1>
        <p className="text-lg mb-2">Task: {taskDescription}</p>
        {taskType && <p className="text-sm opacity-75">Type: {taskType}</p>}
      </div>

      <motion.div
        className="w-64 h-64 rounded-full border-4 border-current"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <button
        onClick={handleComplete}
        className="mt-8 px-6 py-2 rounded-lg bg-current text-white hover:opacity-90 transition-opacity"
      >
        Continue
      </button>
    </div>
  );
}

export default BreatheScreen; 