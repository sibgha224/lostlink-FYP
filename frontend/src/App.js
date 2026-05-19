import React, { useState } from 'react';
import Home from "./Component/Home.jsx";
import Signup from "./Component/Signup.jsx";
import Login from "./Component/Login.jsx";
import ForgotPassword from "./Component/ForgotPassword.jsx";
import ReportLost from "./Component/ReportLost.jsx";
import ReportFound from "./Component/ReportFound.jsx";
import ReportSuccess from "./Component/ReportSuccess.jsx";

function App() {
  const [screen, setScreen] = useState('home');
  const [successData, setSuccessData] = useState(null);

  const isAuthPage =
    screen === 'login' ||
    screen === 'signup' ||
    screen === 'forget';

  const handleReportSuccess = (data) => {
    setSuccessData(data);
    setScreen('report-success');
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col ${
        isAuthPage
          ? "bg-cover bg-center bg-no-repeat"
          : "bg-white"
      }`}
      style={
        isAuthPage
          ? { backgroundImage: "url('/college_bg.JPEG')" }
          : {}
      }
    >

      {/* Overlay */}
      {isAuthPage && (
        <div className="absolute inset-0 bg-slate-900/30 z-[1]"></div>
      )}

      <div className="relative z-[2] w-full flex-1">

        {/* HOME */}
        {screen === 'home' && (
          <Home
            activeScreen={screen}
            onNavigate={(s) => setScreen(s)}
            onGoToLogin={() => setScreen('login')}
            onGoToSignup={() => setScreen('signup')}
            onGoToReportLost={() => setScreen('report-lost')}
            onGoToReportFound={() => setScreen('report-found')}
            onGoToProfile={() => setScreen('profile')}
            onViewLostItems={() => setScreen('lost')}
            onViewFoundItems={() => setScreen('found')}
          />
        )}

        {/* REPORT LOST */}
        {screen === 'report-lost' && (
          <ReportLost
            onGoToHome={() => setScreen('home')}
            onGoToReportLost={() => setScreen('report-lost')}
            onGoToFoundItems={() => setScreen('report-found')}
            onGoToMyReports={() => setScreen('my-reports')}
            onReportSuccess={handleReportSuccess}
            onGoToProfile={() => setScreen('profile')}
          />
        )}

        {/* REPORT FOUND */}
        {screen === 'report-found' && (
          <ReportFound
            onGoToHome={() => setScreen('home')}
            onGoToReportLost={() => setScreen('report-lost')}
            onGoToFoundItems={() => setScreen('report-found')}
            onGoToMyReports={() => setScreen('my-reports')}
            onReportSuccess={handleReportSuccess}
            onGoToProfile={() => setScreen('profile')}
          />
        )}

        {/* REPORT SUCCESS */}
        {screen === 'report-success' && (
          <ReportSuccess
            itemData={successData}
            onGoToHome={() => setScreen('home')}

            onReportAnother={() => {
              const itemType = successData?.type;
              setSuccessData(null);

              if (itemType === 'found') {
                setScreen('report-found');
              } else {
                setScreen('report-lost');
              }
            }}

            onGoToLostItems={() => setScreen('lost')}
            onGoToFoundItems={() => setScreen('found')}
            onGoToProfile={() => setScreen('profile')}
          />
        )}

        {/* MY REPORTS */}
        {screen === 'my-reports' && (
          <div className="flex justify-center items-center min-h-screen text-3xl font-bold">
            My Reports Page
          </div>
        )}

        {/* LOST ITEMS */}
        {screen === 'lost' && (
          <div className="flex justify-center items-center min-h-screen text-3xl font-bold">
            Lost Items Page
          </div>
        )}

        {/* FOUND ITEMS */}
        {screen === 'found' && (
          <FoundItems
            onGoToHome={() => setScreen('home')}
            onGoToLostItems={() => setScreen('lost')}
            onGoToFoundItems={() => setScreen('found')}
            onGoToProfile={() => setScreen('profile')}
            onGoToReportFound={() => setScreen('report-found')}
            onItemClick={(item) => console.log('Clicked item:', item)}
          />
        )}

        {/* PROFILE */}
        {screen === 'profile' && (
          <div className="flex justify-center items-center min-h-screen text-3xl font-bold">
            Profile Page
          </div>
        )}

        {/* SIGNUP */}
        {screen === 'signup' && (
          <div className="flex justify-center items-center h-screen">
            <Signup onGoToLogin={() => setScreen('login')} />
          </div>
        )}

        {/* LOGIN */}
        {screen === 'login' && (
          <div className="flex justify-center items-center h-screen">
            <Login
              onGoToSignup={() => setScreen('signup')}
              onGoToForget={() => setScreen('forget')}
            />
          </div>
        )}

        {/* FORGOT PASSWORD */}
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