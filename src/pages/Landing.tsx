import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, ShieldCheck, Target, PenTool, Download, UploadCloud, Briefcase, GraduationCap, Search, Star, FileDown, MessageSquare } from 'lucide-react';
import { SEO } from '../components/SEO';

const modules = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default', eager: true });

import { imageMap } from '../content/imageMap';

const defaultImages = Object.values(imageMap);

const articles = Object.keys(modules).map((path) => {
  const slug = path.split('/').pop()?.replace('.md', '');
  const content = modules[path] as string;
  const match = content.match(/^#\s+(.*)/m);
  const title = match ? match[1] : slug;
  
  const dateMatch = content.match(/<br\/>(.*?)\*/);
  const dateStr = dateMatch ? dateMatch[1].trim() : 'Unknown';
  const timestamp = dateStr !== 'Unknown' ? new Date(dateStr).getTime() : 0;

  const words = content.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  const previewText = content
    .replace(/^#.*\n/m, '')
    .replace(/^>.*$/gm, '')
    .replace(/---/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[#*_>]/g, '')
    .replace(/^\s*[\r\n]/gm, '')
    .trim()
    .substring(0, 140) + '...';
  
  let image = imageMap[slug || ''];
  if (!image) {
    const hash = (slug || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    image = defaultImages[hash % defaultImages.length];
  }
  
  return { slug, title, image, previewText, readingTime, dateStr, timestamp };
})
.sort((a, b) => b.timestamp - a.timestamp)
.slice(0, 6);

const testimonials = [
  {
    text: "I’ve subscribed to dozens of career newsletters, but Career Insight Labs stands out. The AI resume optimizer combined with the hyper-targeted interview survival guide helped me land my dream job. It's thoughtful, and quietly inspiring.",
    name: "Sarah Jenkins",
    title: "Product Manager",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    text: "I always find something valuable in each career guide. Sometimes, it answers a question that's been on my mind; other times it reveals ATS insights I haven't considered. The BYOK feature is brilliant for privacy.",
    name: "Michael Chen",
    title: "Senior Risk Analyst",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    text: "Reasoned, practical, and clear as glass—the Web App offers a wealth of knowledge and thoughtful advice to navigate your career on your own terms. The Ivy League template got me 3 interviews in a week.",
    name: "Emily Rodriguez",
    title: "Software Engineer",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    text: "The blog is a true gem for anyone on a journey of professional improvement! The way complex ATS algorithms are broken down into actionable steps makes growth feel achievable. My go-to career platform.",
    name: "James Wilson",
    title: "Data Scientist",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg"
  },
  {
    text: "It delivers consistently practical advice for professionals seeking to work smarter. The resume builder stands out for its combination of immediate keyword optimization and strict privacy controls. I genuinely enjoy using it.",
    name: "Anita Patel",
    title: "Operations Manager",
    avatar: "https://randomuser.me/api/portraits/women/89.jpg"
  },
  {
    text: "I was skeptical about AI resume builders until I found this. The targeted Job Description keyword injection got me past the ATS, and the generated STAR behavioral answers saved me during the final interview round.",
    name: "Marcus Johnson",
    title: "Marketing Director",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg"
  }
];

const Landing: React.FC = () => {
  return (
    <>
      <SEO 
        title="Career Insight Labs | Advanced ATS Resume Builder & Analysis"
        description="Decode the ATS algorithm. Build, parse, and optimize your resume using advanced AI technology engineered by former FAANG recruiters."
        url="https://careerinsightlabs.com"
      />
      <div className="landing-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div style={{ marginBottom: '2rem' }}>
            <img src="/logo.png" alt="Career Insight Labs Logo" style={{ width: '72px', height: '72px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
          </div>
          <h1 className="hero-title">
            Master the Hiring Game.<br/><span className="gradient-text">AI Tools & Expert Insights.</span>
          </h1>
          <p className="hero-subtitle">
            We analyze millions of data points to decode what modern Applicant Tracking Systems (ATS) want. Use our free AI tools to optimize your resume instantly and prepare for interviews with hyper-targeted survival guides.
          </p>
          <div className="hero-buttons" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/app" className="btn btn-primary btn-lg">
                Try Free Resume Optimizer <ArrowRight size={18} />
              </Link>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>⚡ Instant Live Preview</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/interview-prep" className="btn btn-primary btn-lg">
                Try Interview Prep Guide <ArrowRight size={18} />
              </Link>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>🎯 JD-Targeted Strategy</span>
            </div>
          </div>
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
          <h3>100% Privacy & BYOK</h3>
          <p>Bring Your Own Key (BYOK) for unlimited, completely private local processing across 14+ flagship models (OpenAI, DeepSeek, etc.). Your data never leaves your browser.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrapper"><Search size={24} className="feature-icon" /></div>
          <h3>JD Trap Analysis</h3>
          <p>Uncover hidden red flags and complex technical requirements in the Job Description. The AI acts as an authoritative expert to demystify confusing JD bullet points.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrapper"><Star size={24} className="feature-icon" /></div>
          <h3>Behavioral STAR Mapping</h3>
          <p>Automatically map your resume bullets to anticipated behavioral questions, generating perfectly structured STAR (Situation, Task, Action, Result) responses for your interview.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrapper"><FileDown size={24} className="feature-icon" /></div>
          <h3>Portable Survival Guides</h3>
          <p>Export your highly customized interview preparation guide as a portable Markdown (.md) file for offline review on Notion, Obsidian, or VS Code before the big day.</p>
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
          {/* Interview Card */}
          <div className="glass-card" style={{ padding: '3rem', borderRadius: '24px', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
             <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #8b5cf6, transparent)' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', borderRadius: '16px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <MessageSquare size={28} style={{ color: '#8b5cf6' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Interview Candidates</h3>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Predict & Prepare</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2.5rem', flex: 1 }}>
              Stop guessing what they will ask. Generate a <strong>hyper-targeted survival guide</strong> based on your exact resume and the target JD to anticipate trap questions.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-color)' }}><CheckCircle size={20} style={{ color: '#8b5cf6' }} /> Clarify confusing JD terms</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-color)' }}><CheckCircle size={20} style={{ color: '#8b5cf6' }} /> Tailored STAR behavioral stories</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-color)' }}><CheckCircle size={20} style={{ color: '#8b5cf6' }} /> Anticipate domain technical questions</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>Loved by Professionals</h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            Hear from the people who have transformed their career trajectory using our AI tools and research.
          </p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, idx) => (
            <div key={idx} className="testimonial-card">
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <img src={t.avatar} alt={t.name} />
                </div>
                <div>
                  <h4 className="testimonial-name">{t.name}</h4>
                  <span className="testimonial-title">{t.title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Insights Section */}
      <section id="insights" className="insights-section">
        <div className="section-header">
          <h2>Featured Insights & Guides</h2>
          <Link to="/blog" className="view-all-link">View all guides <ArrowRight size={16} /></Link>
        </div>
        <div className="articles-grid">
          {articles.map((article, idx) => (
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
                  <span>{article.dateStr}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      </div>
    </>
  );
};

export default Landing;
