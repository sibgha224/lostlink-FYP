import React, { useState } from 'react';
import Home from "./Component/Home.jsx";
import Signup from "./Component/Signup.jsx";
import Login from "./Component/Login.jsx";
import ForgotPassword from "./Component/ForgotPassword.jsx";

function App() {
  // Default screen 'home' rakhi hai
  const [screen, setScreen] = useState('home');

  // Screen change karne ka function
  const navigateTo = (screenName) => {
    setScreen(screenName);
  };

  const appStyle = {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundImage: (screen === 'login' || screen === 'signup' || screen === 'forget') ? "url('/college_bg.JPEG')" : 'none', 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: (screen === 'login' || screen === 'signup' || screen === 'forget') ? 'transparent' : '#ffffff',
  };

  return (
    <div style={appStyle}>
      {/* Background Overlay sirf auth pages ke liye */}
      {(screen === 'login' || screen === 'signup' || screen === 'forget') && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.7)', zIndex: 1 }}></div>
      )}

      <div style={{ position: 'relative', zIndex: 2, width: '100%', flex: 1 }}>
        
        {/* 🚩 Home aur baki pages ke liye Home component call ho raha hai */}
        {/* Hum 'screen' ki value bhej rahe hain taake Navbar ko pata ho kya highlight karna hai */}
        {(screen === 'home' || screen === 'report-lost' || screen === 'report-found' || screen === 'browse') && (
          <Home 
            activeScreen={screen} 
            onNavigate={navigateTo} 
            onGoToLogin={() => setScreen('login')} 
            onGoToSignup={() => setScreen('signup')} 
          />
        )}

        {/* Auth Pages */}
        {screen === 'signup' && <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}><Signup onGoToLogin={() => setScreen('login')} /></div>}
        {screen === 'login' && <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}><Login onGoToSignup={() => setScreen('signup')} onGoToForget={() => setScreen('forget')} /></div>}
        {screen === 'forget' && <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}><ForgotPassword onGoToLogin={() => setScreen('login')} /></div>}
      </div>
    </div>
  );
}

export default App;