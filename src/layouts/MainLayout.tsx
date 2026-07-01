import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowUp } from 'lucide-react';
import CookieBanner from '../components/CookieBanner';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isAppTool = location.pathname === '/app';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `/#${id}`);
    }
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/" onClick={scrollToTop} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img src="/logo.png" alt="Career Insight Labs Logo" style={{ width: '36px', height: '36px', borderRadius: '6px' }} />
            <span className="brand-text">Career Insight Labs</span>
          </Link>
        </div>
        
        <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={scrollToTop}>Home</Link>
          <a href="/#features" onClick={(e) => scrollToSection(e, 'features')}>Features</a>
          <a href="/#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')}>How It Works</a>
          <a href="/#insights" onClick={(e) => scrollToSection(e, 'insights')}>Insights</a>
          <Link to="/blog" onClick={scrollToTop}>Career Guides</Link>
          <Link to="/about" onClick={scrollToTop}>About Us</Link>
          <Link to="/interview-prep" className="nav-cta-outline" onClick={scrollToTop}>
            Interview Prep
          </Link>
          {!isAppTool && (
            <Link to="/app" className="nav-cta" onClick={scrollToTop}>
              Free Resume Optimizer
            </Link>
          )}
        </div>
      </nav>

      <main className="content">
        <Outlet />
      </main>

      {/* Hide footer if we are inside the tool to save screen space */}
      {!isAppTool && (
        <footer className="footer">
          <p>&copy; 2026 Career Insight Labs SaaS. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/privacy-policy" onClick={scrollToTop}>Privacy Policy</Link>
            <Link to="/terms-of-service" onClick={scrollToTop}>Terms of Service</Link>
            <Link to="/disclaimer" onClick={scrollToTop}>Disclaimer</Link>
            <Link to="/about" onClick={scrollToTop}>About Us</Link>
            <Link to="/contact" onClick={scrollToTop}>Contact</Link>
          </div>
        </footer>
      )}

      {/* Floating Back to Top Button (Global) */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop} 
          className="scroll-to-top-btn"
          aria-label="Back to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
      <CookieBanner />
    </div>
  );
};

export default MainLayout;
