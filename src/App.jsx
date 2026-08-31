import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from 'react';
import Home from "./component/Home.jsx";
import Signup from "./component/Signup.jsx";
import Login from "./component/Login.jsx";

function App() {
  const [screen, setScreen] = useState('home');

  const isAuthPage = screen === 'login' || screen === 'signup' || screen === 'forget';

  return (
    <div 
      className={`relative min-h-screen flex flex-col ${isAuthPage ? "bg-cover bg-center bg-no-repeat" : "bg-white"}`}
      style={isAuthPage ? { backgroundImage: "url('/college_bg.jpeg')" } : {}}
    >
      <div className="relative z-[2] w-full flex-1 flex items-center justify-center">

        {/* Home */}
        {(screen === 'home' || screen === 'report-lost' || screen === 'report-found' || screen === 'browse') && (
          <Home
            activeScreen={screen}
            onNavigate={(s) => setScreen(s)}
            onGoToLogin={() => setScreen('login')}
            onGoToSignup={() => setScreen('signup')}
          />
        )}

        {/* Auth Pages */}
        {screen === 'signup' && (
          <Signup onGoToLogin={() => setScreen('login')} />
        )}

        {screen === 'login' && (
          <Login onGoToSignup={() => setScreen('signup')} onGoToForget={() => setScreen('forget')} />
        )}

        {screen === 'forget' && (
          <ForgotPassword onGoToLogin={() => setScreen('login')} />
        )}

      </div>
    </div>
  );
}

export default App;