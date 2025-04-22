'use client';

import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';
import FullscreenToggle from './FullscreenToggle';
import GoogleSignIn from './GoogleSignIn';
import { useGoogleLogin } from '@react-oauth/google';

const words = [
  "your time is worth so much",
  "focus on the now",
  "unlock your superpower",
  "execute"
];

// Saved circle pattern for next page:
// <div className="relative w-64 h-64">
//   {[...Array(3)].map((_, i) => (
//     <div
//       key={i}
//       className={`absolute inset-0 rounded-full border ${
//         darkMode ? 'border-white' : 'border-black'
//       } pulse-circle`}
//       style={{
//         opacity: 0.1 - (i * 0.03),
//         animationDelay: `${i * 0.5}s`,
//         transform: `scale(${1 - (i * 0.2)})`
//       }}
//     />
//   ))}
// </div>

export default function WelcomeScreen({ setCurrentScreen, darkMode, setDarkMode, isLoggedIn, setIsLoggedIn }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [showGoogleAuth, setShowGoogleAuth] = useState(false);

  const handleGoogleLogin = (tokenResponse) => {
    if (tokenResponse.access_token) {
      localStorage.setItem('googleCredential', tokenResponse.access_token);
      setIsLoggedIn(true);
      setCurrentScreen('taskInput');
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleLogin,
    onError: (error) => {
      console.error('Login Failed:', error);
    },
    scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.events.readonly',
    flow: 'implicit'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(0);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setOpacity(1);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleLFG = () => {
    const credential = localStorage.getItem('googleCredential');
    if (!credential) {
      login();
      return;
    }
    setCurrentScreen('taskInput');
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'} relative overflow-hidden transition-colors duration-300`}>
      <div className="absolute top-6 right-6 z-20 flex items-center space-x-4">
        <FullscreenToggle darkMode={darkMode} />
        <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
      
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 ${darkMode ? 'bg-black' : 'bg-gray-100'}`}>
          {!darkMode && (
            <div className="absolute inset-0 bg-gradient-radial from-white via-gray-100 to-gray-100 opacity-60"></div>
          )}
        </div>
        <div className="absolute inset-0">
          <div className={`w-full h-full bg-[url('/images/lion-bg.jpg')] bg-no-repeat bg-center bg-cover filter grayscale ${darkMode ? 'opacity-10' : 'opacity-5'}`}></div>
        </div>
        
        {/* Calm wave animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            className="w-full h-32 wave" 
            viewBox="0 0 100 20" 
            preserveAspectRatio="none"
          >
            <path
              d="M0,10 
                 C25,-12 35,32 50,10
                 C65,-12 75,32 100,10"
              fill="none"
              stroke={darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}
              strokeWidth="1"
              className="wave-path"
            />
          </svg>
        </div>
      </div>
      
      <div className="z-10 flex flex-col h-full">
        <div className="flex-1 flex flex-col justify-center pl-8 pr-16">
          <div className="space-y-4">
            <h1 className={`text-5xl font-semibold tracking-tight ${darkMode ? 'text-white' : 'text-black'}`}>
              Enter the flow state
            </h1>
            
            <div className="h-24 relative">
              {words.map((word, index) => (
                <div
                  key={word}
                  className={`absolute transition-opacity duration-500 ${
                    index === currentWordIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ opacity: index === currentWordIndex ? opacity : 0 }}
                >
                  <p className={`text-2xl font-light ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {word}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pr-16 pb-16">
          <div className="flex flex-col items-end">
            <button 
              onClick={handleLFG}
              className={`px-12 py-5 text-2xl font-semibold transition-all duration-300 relative
                ${darkMode 
                  ? 'text-white hover:border-opacity-50' 
                  : 'text-black hover:border-opacity-50'
                }`}
            >
              <span>LFG</span>
              <div className={`absolute bottom-0 left-0 h-0.5 border-b-2 ${darkMode ? 'border-white' : 'border-black'} button-line opacity-30`}></div>
              <div className={`absolute bottom-0 left-0 h-0.5 border-b-2 ${darkMode ? 'border-white' : 'border-black'} button-line-hover`}></div>
            </button>

            {showGoogleAuth && (
              <div className="mt-4">
                <GoogleSignIn onLogin={handleGoogleLogin} />
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes draw {
          0% {
            stroke-dashoffset: 200;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        .wave-path {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: draw 8s linear infinite;
        }

        .button-line {
          width: 100%;
          transition: opacity 0.3s ease-out;
        }

        .button-line-hover {
          width: 0;
          transition: width 0.3s ease-out;
        }

        button:hover .button-line-hover {
          width: 100%;
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}