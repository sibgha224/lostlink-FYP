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
import AboutSystem from "./component/AboutSystem.jsx";
import TermsOfService from "./component/TermsOfService.jsx";
import PrivacyPolicy from "./component/PrivacyPolicy.jsx";
import Faq from "./component/Faq.jsx";
import ItemDetails from "./component/ItemDetails.jsx";

function App() {
  const [screen, setScreen] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [searchQueryParam, setSearchQueryParam] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
      setScreen('home');
    }
  }, []);

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
  const isAboutPage = screen === 'about-system';
  const isTermsPage = screen === 'terms-of-service';
  const isPrivacyPage = screen === 'privacy-policy';
  const isFaqPage = screen === 'faq';
  const isItemDetailsPage = screen === 'item-details';
  const isHomePage = screen === 'home' || (!isAuthPage && !isReportPage && !isFoundPage && !isLostPage && !isAllPage && !isGuidePage && !isSecurityPage && !isChatPage && !isMyReportsPage && !isProfilePage && !isAboutPage && !isTermsPage && !isPrivacyPage && !isFaqPage && !isItemDetailsPage);
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
      {!isAuthPage && (
        <Navbar 
          isLoggedIn={isLoggedIn}
          activeTab={screen}
          onNavigate={(s) => setScreen(s)}
          onGoToLogin={() => setScreen('login')}
          onGoToSignup={() => setScreen('signup')}
          onLogout={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsLoggedIn(false);
            setScreen('login');
          }}
          onGoToProfile={() => setScreen('profile')}
          onGoToMyReports={() => setScreen('my-reports')}
        />
      )}

      <div className="relative z-[2] w-full flex-1 flex flex-col">
        {isLoggedIn && isHomePage && (
          <Home
            activeScreen={screen}
            isLoggedIn={isLoggedIn}
            onNavigate={(s) => setScreen(s)}
            onGoToLogin={() => setScreen('login')}
            onGoToSignup={() => setScreen('signup')}
            onLogout={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
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
        {isGuidePage && (
          <Guide onGoToHome={() => setScreen('home')} />
        )}
        {isSecurityPage && (
          <SecurityOffice onGoToHome={() => setScreen('home')} />
        )}
        {isChatPage && (
          <ChatScreen
            claimId={activeChat?.claimId}
            partnerName={activeChat?.partnerName}
            onBack={() => setScreen('my-reports')}
          />
        )}
        {isMyReportsPage && (
          <MyReports
            onGoToHome={() => setScreen('home')}
            onOpenChat={(claimId, partnerName) => {
              setActiveChat({ claimId, partnerName });
              setScreen('chat');
            }}
          />
        )}
        {isProfilePage && (
          <ProfileModal 
            onGoToHome={() => setScreen('home')}
            onGoToMyReports={() => setScreen('my-reports')}
            onLogout={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setIsLoggedIn(false);
              setScreen('login');
            }}
          />
        )}
        {isAboutPage && (
          <AboutSystem onGoToHome={() => setScreen('home')} />
        )}
        {isTermsPage && (
          <TermsOfService onGoToHome={() => setScreen('home')} />
        )}
        {isPrivacyPage && (
          <PrivacyPolicy onGoToHome={() => setScreen('home')} />
        )}
        {isFaqPage && (
          <Faq onGoToHome={() => setScreen('home')} />
        )}
        {isAllPage && (
          <AllItems
            initialSearchQuery={searchQueryParam}
            onGoToHome={() => setScreen('home')}
            onGoToFoundItems={() => setScreen('found-items')}
            onGoToLostItems={() => setScreen('lost-items')}
            onGoToReportItem={() => setScreen('report-lost-found')}
            onGoToLogin={() => setScreen('login')}
            onGoToSignup={() => setScreen('signup')}
            onViewDetails={(item) => {
              setSelectedItem(item);
              setScreen('item-details');
            }}
          />
        )}
        {isItemDetailsPage && (
          <ItemDetails
            item={selectedItem}
            onBack={() => setScreen('all-items')}
          />
        )}
        {isLostPage && (
          <LostItems 
            onGoToHome={() => setScreen('home')}
            onGoToFoundItems={() => setScreen('found-items')}
            onGoToReportItem={() => setScreen('report-lost-found')}
            onGoToLogin={() => setScreen('login')}
            onGoToSignup={() => setScreen('signup')}
          />
        )}
        {isFoundPage && (
          <FoundItems 
            onGoToHome={() => setScreen('home')}
            onGoToLostItems={() => setScreen('lost-items')}
            onGoToReportItem={() => setScreen('report-lost-found')}
            onGoToLogin={() => setScreen('login')}
            onGoToSignup={() => setScreen('signup')}
          />
        )}
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