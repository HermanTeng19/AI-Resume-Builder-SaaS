import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      padding: '1.2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 -10px 20px rgba(0,0,0,0.1)',
      zIndex: 9999,
      animation: 'fadeInUp 0.5s ease-out'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', maxWidth: '1000px', width: '100%' }}>
        <Info size={24} style={{ color: '#38bdf8', flexShrink: 0, marginTop: '4px' }} />
        <div style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
          <strong>We Value Your Privacy</strong>
          <p style={{ margin: '0.25rem 0 0 0', color: '#cbd5e1' }}>
            We use cookies to enhance your browsing experience, serve personalized ads, and analyze our traffic. 
            By clicking "Accept All", you consent to our use of cookies. 
            Read our <Link to="/privacy-policy" style={{ color: '#38bdf8', textDecoration: 'underline' }}>Privacy Policy</Link> for more information.
          </p>
        </div>
        <button 
          onClick={handleAccept}
          style={{
            backgroundColor: '#38bdf8',
            color: '#0f172a',
            border: 'none',
            borderRadius: '6px',
            padding: '0.6rem 1.5rem',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            cursor: 'pointer',
            marginLeft: 'auto',
            whiteSpace: 'nowrap',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7dd3fc'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#38bdf8'}
        >
          Accept All
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
