import React, { useState } from 'react';

import Navbar from "./component/Navbar.jsx";
import Home from "./component/Home.jsx";
import Signup from "./component/Signup.jsx";
import Login from "./component/Login.jsx";
import ForgotPassword from "./component/ForgotPassword.jsx";
import ReportLostFound from "./component/ReportLostFound.jsx";
import FoundItems from "./component/FoundItems.jsx";
import LostItems from "./component/LostItems.jsx";
import AllItems from "./component/AllItems.jsx";
import Guide from "./component/Guide.jsx";
import SecurityOffice from "./component/SecurityOffice.jsx";
import ChatScreen from "./component/ChatScreen.jsx";
import MyReports from "./component/MyReports.jsx";
import ProfileModal from "./component/ProfileModal.jsx";

function App() {
  const [screen, setScreen] = useState('login'); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQueryParam, setSearchQueryParam] = useState(''); // Search query store karne ke liye state

  const isAuthPage = screen === 'login' || screen === 'signup' || screen === 'forget';

  const isReportPage = 
    screen === 'Report Lost & Found Items' || 
    screen === 'report-lost-found' || 
    screen === 'report lost & found' ||
    screen === 'report lost & found item';

  const isFoundPage = 
    screen === 'Found Items' || 
    screen === 'found-items' || 
    screen === 'found items';

  const isLostPage = 
    screen === 'Lost Items' || 
    screen === 'lost-items' || 
    screen === 'lost items';

  const isAllPage = 
    screen === 'all-items' || 
    screen === 'all items';

  const isGuidePage = screen === 'guide';
  const isSecurityPage = screen === 'security';
  const isChatPage = screen === 'chat';
  const isMyReportsPage = screen === 'my-reports';
  const isProfilePage = screen === 'profile';
  const isHomePage = screen === 'home' || (!isAuthPage && !isReportPage && !isFoundPage && !isLostPage && !isAllPage && !isGuidePage && !isSecurityPage && !isChatPage && !isMyReportsPage && !isProfilePage);

  // SECURITY GUARD: Agar user login nahi hai, aur auth pages ke ilawa kisi aur page par jane ki koshish kare, toh forcefully login par bhej dein
  if (!isLoggedIn && !isAuthPage) {
    if (screen !== 'login') {
      setTimeout(() => setScreen('login'), 0);
    }
  }

  return (
    <div 
      className={`relative min-h-screen flex flex-col w-full ${isAuthPage ? "bg-cover bg-center bg-no-repeat" : "bg-white"}`}
      style={isAuthPage ? { backgroundImage: "url('/college_bg.jpeg')" } : {}}
    >
      {/* COMMON NAVBAR */}
      {!isAuthPage && (
        <Navbar 
          isLoggedIn={isLoggedIn}
          activeTab={screen}
          onNavigate={(s) => setScreen(s)}
          onGoToLogin={() => setScreen('login')}
          onGoToSignup={() => setScreen('signup')}
          onLogout={() => {
            setIsLoggedIn(false);
            setScreen('login');
          }}
          onGoToProfile={() => setScreen('profile')}
          onGoToMyReports={() => setScreen('my-reports')}
        />
      )}

      <div className="relative z-[2] w-full flex-1 flex flex-col">

        {/* 1. HOME PAGE */}
        {isLoggedIn && isHomePage && (
          <Home
            activeScreen={screen}
            isLoggedIn={isLoggedIn}
            onNavigate={(s) => setScreen(s)}
            onGoToLogin={() => setScreen('login')}
            onGoToSignup={() => setScreen('signup')}
            onLogout={() => {
              setIsLoggedIn(false);
              setScreen('login');
            }}
            onGoToReportItem={() => setScreen('report-lost-found')}
            onGoToFoundItems={() => setScreen('found-items')}
            onGoToLostItems={() => setScreen('lost-items')}
            onGoToAllItems={(query) => {
              if (query) setSearchQueryParam(query);
              else setSearchQueryParam('');
              setScreen('all-items');
            }}
            onGoToGuide={() => setScreen('guide')}
            onGoToSecurity={() => setScreen('security')}
            onGoToChat={() => setScreen('chat')}
            onGoToMyReports={() => setScreen('my-reports')}
            onGoToProfile={() => setScreen('profile')}
          />
        )}

        {/* 2. GUIDE PAGE */}
        {isGuidePage && (
          <Guide onGoToHome={() => setScreen('home')} />
        )}

        {/* 3. SECURITY OFFICE PAGE */}
        {isSecurityPage && (
          <SecurityOffice onGoToHome={() => setScreen('home')} />
        )}

        {/* 4. CHAT SCREEN */}
        {isChatPage && (
          <ChatScreen onBack={() => setScreen('my-reports')} />
        )}

        {/* 5. MY REPORTS PAGE */}
        {isMyReportsPage && (
          <MyReports 
            onGoToHome={() => setScreen('home')}
            onOpenChat={() => setScreen('chat')}
          />
        )}

        {/* 6. PROFILE MODAL / PAGE */}
        {isProfilePage && (
          <ProfileModal 
            onGoToHome={() => setScreen('home')}
            onGoToMyReports={() => setScreen('my-reports')}
            onLogout={() => {
              setIsLoggedIn(false);
              setScreen('login');
            }}
          />
        )}

        {/* 7. ALL ITEMS */}
        {isAllPage && (
          <AllItems 
            initialSearchQuery={searchQueryParam}
            onGoToHome={() => setScreen('home')}
            onGoToFoundItems={() => setScreen('found-items')}
            onGoToLostItems={() => setScreen('lost-items')}
            onGoToReportItem={() => setScreen('report-lost-found')}
            onGoToLogin={() => setScreen('login')}
            onGoToSignup={() => setScreen('signup')}
          />
        )}

        {/* 8. LOST ITEMS */}
        {isLostPage && (
          <LostItems 
            onGoToHome={() => setScreen('home')}
            onGoToFoundItems={() => setScreen('found-items')}
            onGoToReportItem={() => setScreen('report-lost-found')}
            onGoToLogin={() => setScreen('login')}
            onGoToSignup={() => setScreen('signup')}
          />
        )}

        {/* 9. FOUND ITEMS */}
        {isFoundPage && (
          <FoundItems 
            onGoToHome={() => setScreen('home')}
            onGoToLostItems={() => setScreen('lost-items')}
            onGoToReportItem={() => setScreen('report-lost-found')}
            onGoToLogin={() => setScreen('login')}
            onGoToSignup={() => setScreen('signup')}
          />
        )}

        {/* 10. REPORT LOST & FOUND */}
        {isReportPage && (
          <ReportLostFound 
            onNavigate={(s) => setScreen(s)} 
            onGoToHome={() => setScreen('home')}
            onGoToReportItem={() => setScreen('report-lost-found')}
            onGoToFoundItems={() => setScreen('found-items')}
            onGoToLostItems={() => setScreen('lost-items')}
            onGoToMyReports={() => setScreen('my-reports')}
            onReportSuccess={(data) => {
              console.log('Report submitted:', data);
              setScreen('home');
            }}
          />
        )}

        {/* AUTHENTICATION PAGES */}
        {screen === 'signup' && (
          <Signup 
            onSignupSuccess={() => {
              setIsLoggedIn(true);
              setScreen('home');
            }}
            onGoToLogin={() => setScreen('login')} 
          />
        )}

        {screen === 'login' && (
          <Login 
            onLoginSuccess={() => {
              setIsLoggedIn(true);
              setScreen('home');
            }}
            onGoToSignup={() => setScreen('signup')} 
            onGoToForget={() => setScreen('forget')} 
          />
        )}

        {screen === 'forget' && (
          <ForgotPassword onGoToLogin={() => setScreen('login')} />
        )}

      </div>
    </div>
  );
}

export default App;