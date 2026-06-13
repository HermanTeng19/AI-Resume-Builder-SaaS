import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, ShieldCheck, Target, PenTool, Download, UploadCloud, Briefcase, GraduationCap } from 'lucide-react';

const modules = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default', eager: true });
const articles = Object.keys(modules).map((path) => {
  const slug = path.split('/').pop()?.replace('.md', '');
  const content = modules[path] as string;
  const match = content.match(/^#\s+(.*)/m);
  return { slug, title: match ? match[1] : slug };
}).slice(0, 3); // Get latest 3

const Landing: React.FC = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">⚡ 2026 ATS Algorithm Research</div>
          <h1 className="hero-title">
            Hack the ATS.<br/><span className="gradient-text">Land the Interview.</span>
          </h1>
          <p className="hero-subtitle">
            We analyze millions of data points to decode what modern Applicant Tracking Systems (ATS) want. Read our latest research or use our free AI tool to optimize your resume instantly.
          </p>
          <div className="hero-buttons">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/app" className="btn btn-primary btn-lg">
                Try Free Resume Optimizer <ArrowRight size={18} />
              </Link>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>🎁 Includes 3 Free AI Credits</span>
            </div>
            <Link to="/blog" className="btn btn-secondary btn-lg" style={{ alignSelf: 'flex-start' }}>
              Read Career Guides
            </Link>
          </div>
        </div>
        <div style={{ marginTop: '5rem', display: 'flex', justifyContent: 'center', width: '100%', maxWidth: '1200px', margin: '5rem auto 0 auto' }}>
          <img 
            src="/hero-abstract.png" 
            alt="Career Insight Labs Agent Console" 
            style={{ width: '100%', borderRadius: '22px', border: '1px solid var(--border-color)', objectFit: 'cover', height: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }} 
          />
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="features-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', padding: '2rem 2rem 6rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="feature-card">
          <div className="feature-icon-wrapper"><Target size={24} className="feature-icon" /></div>
          <h3>JD-Targeted Precision</h3>
          <p>Don't shoot in the dark. Paste your target Job Description, and our AI will reverse-engineer the keywords, seamlessly weaving them into your profile to guarantee high ATS match scores.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrapper"><PenTool size={24} className="feature-icon" /></div>
          <h3>Granular AI Fine-Tuning</h3>
          <p>Beyond full auto-generation, selectively optimize local details: rewrite your Professional Summary, inject the STAR method into specific Work Experience bullets, or auto-categorize your Tech Skills.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrapper"><UploadCloud size={24} className="feature-icon" /></div>
          <h3>1-Click AI Auto-Fill</h3>
          <p>Upload your messy, outdated PDF or Word resume. Watch as our AI instantly parses, cleans, and restructures your raw data into our real-time WYSIWYG editor within seconds.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrapper"><Download size={24} className="feature-icon" /></div>
          <h3>Native PDF & Word Export</h3>
          <p>No paywalls, no watermarks. Instantly download your finished resume as a pixel-perfect ATS-compliant PDF, or as a fully editable Microsoft Word (.docx) file for manual tweaks.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrapper"><ShieldCheck size={24} className="feature-icon" /></div>
          <h3>Elite ATS-Safe Templates</h3>
          <p>We don't do flashy, unparseable graphics. Choose from 3 battle-tested, professional formats (Silicon Valley, Ivy League, Modern) designed exclusively to bypass ATS filters.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrapper"><CheckCircle size={24} className="feature-icon" /></div>
          <h3>3 Free Tries & Privacy BYOK</h3>
          <p>Get 3 free generation credits instantly. After that, Bring Your Own Key (BYOK) for unlimited, completely private local processing across 14+ flagship models (OpenAI, DeepSeek, etc.).</p>
        </div>
      </section>

      {/* How It Works / Audience Section */}
      <section id="how-it-works" className="audience-section" style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '100px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '1rem' }}>
            HOW IT WORKS
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>One Platform, Every Career Stage</h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            Whether you're a seasoned executive optimizing for strict ATS parsers or a recent graduate needing impactful copy, our AI adapts to your needs.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          {/* Pro Card */}
          <div className="glass-card" style={{ padding: '3rem', borderRadius: '24px', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, var(--primary-color), transparent)' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', borderRadius: '16px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <Briefcase size={28} style={{ color: 'var(--primary-color)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Experienced Pros</h3>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Format & Optimize</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2.5rem', flex: 1 }}>
              Skip the manual formatting. Directly generate <strong>ATS-optimized structured resumes</strong> with real-time preview. Ensure your rich experience parses flawlessly into any HR system.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-color)' }}><CheckCircle size={20} style={{ color: 'var(--primary-color)' }} /> Real-time WYSIWYG preview</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-color)' }}><CheckCircle size={20} style={{ color: 'var(--primary-color)' }} /> Strict ATS-compliant templates</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-color)' }}><CheckCircle size={20} style={{ color: 'var(--primary-color)' }} /> Instant PDF & Word (.docx) export</li>
            </ul>
          </div>

          {/* Newcomer Card */}
          <div className="glass-card" style={{ padding: '3rem', borderRadius: '24px', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
             <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #10b981, transparent)' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', borderRadius: '16px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <GraduationCap size={28} style={{ color: '#10b981' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Fresh Graduates & Juniors</h3>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enhance & Rewrite</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2.5rem', flex: 1 }}>
              Turn academic projects and internships into compelling achievements. Use our <strong>fine-tuned AI to rewrite your experiences</strong>, making your resume instantly attractive to recruiters.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-color)' }}><CheckCircle size={20} style={{ color: '#10b981' }} /> Smart STAR method injection</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-color)' }}><CheckCircle size={20} style={{ color: '#10b981' }} /> Action verb enhancements</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-color)' }}><CheckCircle size={20} style={{ color: '#10b981' }} /> Automatic skills extraction & sorting</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Latest Insights Section */}
      <section id="insights" className="insights-section">
        <div className="section-header">
          <h2>Latest from our ATS Researchers</h2>
          <Link to="/blog" className="view-all-link">View all guides <ArrowRight size={16} /></Link>
        </div>
        <div className="articles-grid">
          {articles.map(article => (
            <Link to={`/blog/${article.slug}`} key={article.slug} className="article-card glass-card">
              <h3>{article.title}</h3>
              <span className="article-read-more">Read full analysis &rarr;</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
