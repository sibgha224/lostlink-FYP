import React, { useState } from 'react';
import Home from "./component/Home.jsx";
import Signup from "./component/Signup.jsx";
import Login from "./component/Login.jsx";
import ForgotPassword from "./component/ForgotPassword.jsx";
import ReportLostFound from "./component/ReportLostFound.jsx";

function App() {
  const [screen, setScreen] = useState('home');

  const isAuthPage = screen === 'login' || screen === 'signup' || screen === 'forget';

  const isReportPage = 
    screen === 'Report Lost & Found Items' || 
    screen === 'report-lost-found' || 
    screen === 'report lost & found' ||
    screen === 'report lost & found item';

  return (
    <div 
      className={`relative min-h-screen flex flex-col w-full ${isAuthPage ? "bg-cover bg-center bg-no-repeat" : "bg-white"}`}
      style={isAuthPage ? { backgroundImage: "url('/college_bg.jpeg')" } : {}}
    >
      <div className="relative z-[2] w-full flex-1 flex flex-col">

        {!isReportPage && !isAuthPage && (
          <Home
            activeScreen={screen}
            onNavigate={(s) => setScreen(s)}
            onGoToLogin={() => setScreen('login')}
            onGoToSignup={() => setScreen('signup')}
            onGoToReportItem={() => setScreen('report-lost-found')}
          />
        )}

        {isReportPage && (
          <ReportLostFound 
            onNavigate={(s) => setScreen(s)} 
            onGoToHome={() => setScreen('home')}
            onGoToReportItem={() => setScreen('report-lost-found')}
            onGoToFoundItems={() => setScreen('found-items')}
            onGoToMyReports={() => setScreen('my-reports')}
            onReportSuccess={(data) => {
              console.log('Report submitted:', data);
              setScreen('home');
            }}
          />
        )}

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