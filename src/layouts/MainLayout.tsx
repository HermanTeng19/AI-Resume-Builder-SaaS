import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const isAppTool = location.pathname === '/app';

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/">Career Insight Labs</Link>
        </div>
        <div className="navbar-links">
          <Link to="/blog">Career Guides</Link>
          <Link to="/about">About Us</Link>
          {!isAppTool && (
            <Link to="/app" className="nav-cta">
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
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </footer>
      )}
    </div>
  );
};

export default MainLayout;
