import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import { SEO } from '../components/SEO';

const NotFound: React.FC = () => {
  return (
    <div className="page-container" style={{ textAlign: 'center', padding: '6rem 2rem', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <SEO 
        title="Page Not Found | Career Insight Labs"
        description="The page you are looking for does not exist."
        url="https://careerinsightlabs.com/404"
      />
      <div style={{ backgroundColor: '#f1f5f9', padding: '1.5rem', borderRadius: '50%', marginBottom: '2rem' }}>
        <AlertCircle size={48} color="#94a3b8" />
      </div>
      <h1 style={{ fontSize: '3rem', color: '#0f172a', marginBottom: '1rem', fontWeight: 800 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', color: '#334155', marginBottom: '1.5rem' }}>Page Not Found</h2>
      <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
        Oops! We couldn't find the page you were looking for. It might have been moved or doesn't exist anymore.
      </p>
      <Link to="/" className="btn-cohere" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '1rem', fontWeight: 600, textDecoration: 'none' }}>
        <Home size={18} /> Back to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
