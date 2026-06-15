import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search } from 'lucide-react';
import { imageMap } from '../content/imageMap';
import { SEO } from '../components/SEO';

const modules = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default', eager: true });

// imageMap imported from content/imageMap.ts

const defaultImages = Object.values(imageMap);

const articles = Object.keys(modules).map((path) => {
  const slug = path.split('/').pop()?.replace('.md', '');
  const content = modules[path] as string;
  // Extract title
  const match = content.match(/^#\s+(.*)/m);
  const title = match ? match[1] : slug;
  
  // Extract date
  const dateMatch = content.match(/<br\/>(.*?)\*/);
  const date = dateMatch ? dateMatch[1].trim() : 'Unknown';

  // Calculate reading time
  const words = content.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  // Create a clean preview text by removing markdown chars and author block
  const previewText = content
    .replace(/^#.*\n/m, '') // Remove H1 Title
    .replace(/^>.*$/gm, '') // Remove Author blockquotes
    .replace(/---/g, '') // Remove hr
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/[#*_>]/g, '') // Remove remaining markdown symbols
    .replace(/^\s*[\r\n]/gm, '') // Remove empty lines
    .trim()
    .substring(0, 140) + '...';
  
  // Assign image
  let image = imageMap[slug || ''];
  if (!image) {
    const hash = (slug || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    image = defaultImages[hash % defaultImages.length];
  }
  
  return { slug, title, previewText, image, date, readingTime };
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const BlogList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = articles.filter(article => 
    article.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    article.previewText.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="blog-list-wrapper">
      <SEO 
        title="Career Growth Guides & Playbook | Career Insight Labs"
        description="Proven playbooks and tactical advice to help you land your dream role and level up your career."
        url="https://careerinsightlabs.com/blog"
      />
      <div className="blog-header-section">
        <div className="page-container" style={{ background: 'transparent', border: 'none', boxShadow: 'none', textAlign: 'center', margin: '2rem auto' }}>
          <div className="hero-badge" style={{ display: 'inline-flex', marginBottom: '1.5rem', animation: 'fadeInUp 0.6s', backgroundColor: 'transparent', border: '1px solid var(--coral)', color: 'var(--coral)', borderRadius: '8px', padding: '8px 14px', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px', letterSpacing: '0' }}>
            <BookOpen size={16} style={{ marginRight: '0.5rem' }}/> Knowledge Base
          </div>
          <h1 className="hero-title" style={{ fontFamily: 'var(--font-display)', fontSize: '60px', marginBottom: '1.5rem', animation: 'fadeInUp 0.8s', color: 'var(--cohere-black)', letterSpacing: '-1.2px', fontWeight: 500 }}>
            Career Growth Guides & Playbook
          </h1>
          <p className="hero-subtitle" style={{ margin: '0 auto', maxWidth: '600px', fontSize: '1.2rem', animation: 'fadeInUp 1s' }}>
            Proven playbooks and tactical advice to help you land your dream role and level up your career.
          </p>

          <div style={{ marginTop: '3rem', maxWidth: '600px', margin: '3rem auto 0 auto', position: 'relative', animation: 'fadeInUp 1.2s' }}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search guides, keywords, or topics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 16px 16px 48px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                fontSize: '16px',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>
        </div>
      </div>

      <div className="page-container" style={{ margin: '4rem auto 6rem auto', padding: '0 2rem', background: 'transparent', border: 'none', boxShadow: 'none', maxWidth: '1300px' }}>
        {filteredArticles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.2rem' }}>No guides found matching "{searchQuery}".</p>
          </div>
        ) : (
          <div className="articles-grid">
            {filteredArticles.map((article, idx) => (
              <Link 
                to={`/blog/${article.slug}`} 
                key={article.slug} 
                className="flat-grid-card" 
                style={{ animation: `fadeInUp ${1 + Math.min(idx, 5) * 0.1}s cubic-bezier(0.16, 1, 0.3, 1)` }}
              >
                <img src={article.image} alt={article.title} />
                <div className="card-content">
                  <h3>{article.title}</h3>
                  <p>{article.previewText}</p>
                  <div className="card-meta">
                    <span>{article.readingTime} min read</span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
