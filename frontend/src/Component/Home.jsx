import React from 'react';

const Home = (props) => {
  const pageStyle = {
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    backgroundColor: '#ffffff',
    color: '#0f172a',
    margin: 0,
    padding: 0,
  };

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 80px',
    background: '#ffffff',
    borderBottom: '1px solid #f1f5f9',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  };

  const heroSectionStyle = {
    display: 'flex',
    padding: '80px',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    gap: '40px',
  };

  const statsSectionStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '60px 80px',
    backgroundColor: '#1e293b', 
    color: '#ffffff',
    borderRadius: '24px',
    margin: '0 80px 60px 80px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  };

  const reportedItems = [
    { type: 'LOST', name: 'Blue Backpack', location: 'Science Building - Room 204', status: 'Reported 3h ago', img: '/backpack.jpeg' },
    { type: 'FOUND', name: 'Apple AirPods', location: 'Student Union Cafe', status: 'Reported 12h ago', img: '/airpods.jpeg' },
    { type: 'LOST', name: 'House Keys', location: 'Main Gymnasium Locker', status: 'Reported yesterday', img: '/keys.jpeg' },
    { type: 'FOUND', name: 'Scientific Calculator', location: 'Engineering Lab 4', status: 'Reported yesterday', img: '/calculator.jpeg' },
  ];

  const testimonialStyle = {
    background: '#ffffff',
    padding: '30px',
    borderRadius: '20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    textAlign: 'left',
    border: '1px solid #f1f5f9'
  };

  return (
    <div style={pageStyle}>
      {/* 🚩 1. Navbar Section */}
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: '#2563eb', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <span style={{ fontSize: '1.6rem', fontWeight: 'bold', letterSpacing: '-1px', color: '#0f172a' }}>LostLink</span>
        </div>
        
        <div style={{ display: 'flex', gap: '25px', color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>
          <span style={{color: '#2563eb', cursor: 'pointer'}}>Home</span>
          <span style={{cursor: 'pointer'}} onClick={props.onGoToReportLost}>Report Lost</span>
          <span style={{cursor: 'pointer'}} onClick={props.onGoToReportFound}>Report Found</span>
          <span style={{cursor: 'pointer'}}>Browse All</span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={props.onGoToLogin} style={{ padding: '9px 22px', borderRadius: '25px', border: '1px solid #e2e8f0', background: 'transparent', color: '#64748b', fontWeight: 'bold', cursor: 'pointer' }}>Login</button>
          <button onClick={props.onGoToSignup} style={{ padding: '9px 22px', borderRadius: '25px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Register</button>
        </div>
      </nav>

      {/* 🚩 2. Hero Section */}
      <section style={heroSectionStyle}>
        <div style={{ maxWidth: '550px' }}>
          <span style={{ color: '#2563eb', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}> Campus Services </span>
          <h1 style={{ fontSize: '3.6rem', fontWeight: 'bold', color: '#0f172a', margin: '15px 0', lineHeight: '1.05', letterSpacing: '-2px' }}>
            Find What You Lost, Return What You Found
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '30px' }}>
            The central hub for recovering lost belongings across the college. Fast, secure, and student-run.
          </p>
          
          <div style={{ display: 'flex', gap: '12px', marginBottom: '25px', padding: '10px', borderRadius: '15px', border: '1px solid #e2e8f0', background: '#fff' }}>
            <input type="text" placeholder="Search for lost or found items..." style={{ flex: 1, padding: '15px 20px', borderRadius: '10px', border: '1px solid #f1f5f9', outline: 'none' }} />
            <button style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0 30px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Search</button>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={props.onGoToReportLost} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>⊕ Report Lost Item</button>
            <button onClick={props.onGoToReportFound} style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', padding: '12px 25px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>⊞ Report Found Item</button>
          </div>
        </div>

        <div style={{ width: '500px', height: '350px', borderRadius: '20px', overflow: 'hidden' }}>
          <img src="/hero-students.jpeg" alt="Students Group" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </section>

      {/* 🚩 3. Stats Section */}
      <div style={statsSectionStyle}>
        <div style={{textAlign: 'center'}}><h3 style={{fontSize: '3.2rem', margin: 0, fontWeight: 'bold'}}>1.2k+</h3><p style={{color: '#cbd5e1', margin: '5px 0'}}>Items Returned</p></div>
        <div style={{textAlign: 'center'}}><h3 style={{fontSize: '3.2rem', margin: 0, fontWeight: 'bold'}}>85%</h3><p style={{color: '#cbd5e1', margin: '5px 0'}}>Success Rate</p></div>
        <div style={{textAlign: 'center'}}><h3 style={{fontSize: '3.2rem', margin: 0, fontWeight: 'bold'}}>24/7</h3><p style={{color: '#cbd5e1', margin: '5px 0'}}>College Access</p></div>
        <div style={{textAlign: 'center'}}><h3 style={{fontSize: '3.2rem', margin: 0, fontWeight: 'bold'}}>15min</h3><p style={{color: '#cbd5e1', margin: '5px 0'}}>Avg. Response</p></div>
      </div>

      {/* 🚩 4. Recently Reported Section */}
      <section style={{ padding: '0 80px 60px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.2rem', margin: '0', fontWeight: 'bold', color: '#0f172a' }}>Recently Reported Items</h2>
          <button style={{ background: 'transparent', color: '#2563eb', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>View All Items →</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' }}>
          {reportedItems.map((item, index) => (
            <div key={index} style={{ background: '#f8fafc', borderRadius: '15px', border: '1px solid #f1f5f9', padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '100%', height: '140px', borderRadius: '10px', marginBottom: '15px', overflow: 'hidden' }}>
                <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', color: item.type === 'LOST' ? '#dc2626' : '#16a34a' }}>{item.type}</span>
              </div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a' }}>{item.name}</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 15px 0', flex: 1 }}>{item.location}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
                <span>{item.status}</span>
                <button style={{ background: 'transparent', color: '#2563eb', border: 'none', fontWeight: '500', cursor: 'pointer' }}>Details →</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🚩 5. Testimonials (Student Success Stories) */}
      <section style={{ padding: '80px', backgroundColor: '#f8fafc', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>Student Success Stories</h2>
        <p style={{ color: '#64748b', marginBottom: '50px' }}>See how we are helping students reconnect with their lost belongings every day.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
          <div style={testimonialStyle}>
            <div style={{color: '#fbbf24', marginBottom: '10px'}}>★★★★★</div>
            <p style={{fontStyle: 'italic', color: '#334155', lineHeight: '1.6', marginBottom: '20px'}}>"Found my keys within an hour! Someone had already posted them here before I even realized they were gone."</p>
            <p style={{fontWeight: 'bold', margin: 0}}>Sarah Jenkins</p>
            <p style={{fontSize: '0.85rem', color: '#94a3b8'}}>Psychology Major</p>
          </div>
          <div style={testimonialStyle}>
            <div style={{color: '#fbbf24', marginBottom: '10px'}}>★★★★★</div>
            <p style={{fontStyle: 'italic', color: '#334155', lineHeight: '1.6', marginBottom: '20px'}}>"I left my AirPods at the library. This portal is a lifesaver for forgetful students like me! Highly recommended."</p>
            <p style={{fontWeight: 'bold', margin: 0}}>Marcus Chen</p>
            <p style={{fontSize: '0.85rem', color: '#94a3b8'}}>Computer Science</p>
          </div>
          <div style={testimonialStyle}>
            <div style={{color: '#fbbf24', marginBottom: '10px'}}>★★★★★</div>
            <p style={{fontStyle: 'italic', color: '#334155', lineHeight: '1.6', marginBottom: '20px'}}>"Reported a calculator I found, and the owner reached out instantly. The verification process was so smooth."</p>
            <p style={{fontWeight: 'bold', margin: 0}}>Elena Rodriguez</p>
            <p style={{fontSize: '0.85rem', color: '#94a3b8'}}>Biology Senior</p>
          </div>
        </div>
      </section>

      {/* 🚩 6. Footer */}
      <footer style={{ padding: '80px', borderTop: '1px solid #f1f5f9', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '40px' }}>
          <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{ background: '#2563eb', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <span style={{ fontSize: '1.4rem', fontWeight: 'bold', letterSpacing: '-1px', color: '#0f172a' }}>LostLink</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>Helping college students recover what they've lost through community cooperation.</p>
          </div>
          <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '20px' }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, color: '#64748b', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <li>About the Portal</li>
                  <li>Terms of Service</li>
              </ul>
          </div>
          <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '20px' }}>Support</h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>📧 support@lostlink.edu</p>
          </div>
      </footer>
    </div>
  );
};

export default Home;