import React, { useState } from 'react';
import Home from "./Component/Home.jsx";
import Signup from "./Component/Signup.jsx";
import Login from "./Component/Login.jsx";
import ForgotPassword from "./Component/ForgotPassword.jsx";

function App() {
  const [screen, setScreen] = useState('home');

  const isAuthPage = screen === 'login' || screen === 'signup' || screen === 'forget';

  return (
    <div className={`relative min-h-screen flex flex-col ${isAuthPage ? "bg-cover bg-center bg-no-repeat" : "bg-white"}`}
      style={isAuthPage ? { backgroundImage: "url('/college_bg.JPEG')" } : {}}>

      {/* Dark Overlay - sirf auth pages par */}
      {isAuthPage && (
        <div className="absolute inset-0 bg-slate-900/30 z-[1]"></div>
      )}

      <div className="relative z-[2] w-full flex-1">

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
          <div className="flex justify-center items-center h-screen">
            <Signup onGoToLogin={() => setScreen('login')} />
          </div>
        )}

        {screen === 'login' && (
          <div className="flex justify-center items-center h-screen">
            <Login onGoToSignup={() => setScreen('signup')} onGoToForget={() => setScreen('forget')} />
          </div>
        )}

        {screen === 'forget' && (
          <div className="flex justify-center items-center h-screen">
            <ForgotPassword onGoToLogin={() => setScreen('login')} />
          </div>
        )}

      </div>
    </div>
  );
}

export default App;