import React, { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAppTool = location.pathname === '/app';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
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
          <Link to="/" onClick={scrollToTop}>Career Insight Labs</Link>
        </div>
        <div className="navbar-links">
          <Link to="/" onClick={scrollToTop}>Home</Link>
          <a href="/#features" onClick={(e) => scrollToSection(e, 'features')}>Features</a>
          <a href="/#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')}>How It Works</a>
          <a href="/#insights" onClick={(e) => scrollToSection(e, 'insights')}>Insights</a>
          <Link to="/blog" onClick={scrollToTop}>Career Guides</Link>
          <Link to="/about" onClick={scrollToTop}>About Us</Link>
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
            <Link to="/about" onClick={scrollToTop}>About Us</Link>
            <Link to="/contact" onClick={scrollToTop}>Contact</Link>
          </div>
        </footer>
      )}
    </div>
  );
};

export default MainLayout;
