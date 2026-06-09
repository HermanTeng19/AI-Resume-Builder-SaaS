import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft, Clock, ArrowUp } from 'lucide-react';

const modules = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default', eager: true });

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState('');
  const [readingTime, setReadingTime] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Always start reading from the top
    const path = `../content/blog/${slug}.md`;
    if (modules[path]) {
      const text = modules[path] as string;
      setContent(text);
      
      // Simple reading time calculation (approx 200 words per minute)
      const words = text.trim().split(/\s+/).length;
      setReadingTime(Math.max(1, Math.ceil(words / 200)));
    } else {
      setContent('# Article not found\n\nSorry, the article you are looking for does not exist.');
    }
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled down 400px
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="blog-post-wrapper">
      <div className="blog-reading-container">
        <Link to="/blog" className="back-link">
          <ArrowLeft size={16} className="back-icon" /> Back to all guides
        </Link>
        
        <div className="article-meta">
          <Clock size={16} color="var(--primary-color)" />
          <span>{readingTime} min read</span>
        </div>

        <article className="markdown-body blog-markdown">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeRaw]}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop} 
          className="scroll-to-top-btn"
          aria-label="Back to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
};

export default BlogPost;
