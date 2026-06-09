import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';

const modules = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default', eager: true });

const articles = Object.keys(modules).map((path) => {
  const slug = path.split('/').pop()?.replace('.md', '');
  const content = modules[path] as string;
  // Extract title
  const match = content.match(/^#\s+(.*)/m);
  const title = match ? match[1] : slug;
  // Create a clean preview text by removing markdown chars and author block
  const previewText = content
    .replace(/^#.*\n/m, '') // Remove H1 Title
    .replace(/^>\s*\*?Author:.*$/m, '') // Remove Author line
    .replace(/---/g, '') // Remove hr
    .replace(/[#*_>]/g, '') // Remove remaining markdown symbols
    .replace(/^\s*[\r\n]/gm, '') // Remove empty lines
    .trim()
    .substring(0, 140) + '...';
  
  return { slug, title, previewText };
});

const BlogList: React.FC = () => {
  return (
    <div className="blog-list-wrapper">
      <div className="blog-header-section">
        <div className="page-container" style={{ background: 'transparent', border: 'none', boxShadow: 'none', textAlign: 'center', margin: '2rem auto' }}>
          <div className="hero-badge" style={{ display: 'inline-flex', marginBottom: '1.5rem', animation: 'fadeInUp 0.6s', backgroundColor: 'transparent', border: '1px solid var(--coral)', color: 'var(--coral)', borderRadius: '8px', padding: '8px 14px', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', letterSpacing: '0' }}>
            <BookOpen size={16} style={{ marginRight: '0.5rem' }}/> Knowledge Base
          </div>
          <h1 className="hero-title" style={{ fontFamily: 'var(--font-display)', fontSize: '60px', marginBottom: '1.5rem', animation: 'fadeInUp 0.8s', color: 'var(--cohere-black)', letterSpacing: '-1.2px', fontWeight: 500 }}>
            Career Guides & ATS Insights
          </h1>
          <p className="hero-subtitle" style={{ margin: '0 auto', maxWidth: '600px', fontSize: '1.2rem', animation: 'fadeInUp 1s' }}>
            In-depth strategies on how to bypass algorithmic filters, optimize your resume keywords, and land interviews at top-tier companies.
          </p>
        </div>
        <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center', animation: 'fadeInUp 1.2s', width: '100%', maxWidth: '1200px', margin: '4rem auto 0 auto' }}>
          <img 
            src="/blog-hero-abstract.png" 
            alt="Algorithm Knowledge Graph" 
            style={{ width: '100%', borderRadius: '22px', border: '1px solid var(--border-color)', objectFit: 'cover', height: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }} 
          />
        </div>
      </div>

      <div className="page-container" style={{ margin: '0 auto 6rem auto', background: 'transparent', border: 'none', boxShadow: 'none', maxWidth: '1200px' }}>
        <div className="articles-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {articles.map((article, idx) => (
            <Link 
              to={`/blog/${article.slug}`} 
              key={article.slug} 
              className="article-card glass-card" 
              style={{ textDecoration: 'none', animation: `fadeInUp ${1 + idx * 0.1}s cubic-bezier(0.16, 1, 0.3, 1)` }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '1rem', color: 'var(--ink)', fontWeight: 500, letterSpacing: '0', lineHeight: 1.3 }}>
                  {article.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.5', marginBottom: '2rem', flex: 1 }}>
                  {article.previewText}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--action-blue)', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px' }}>
                  Read full analysis <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} className="read-more-icon" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogList;
