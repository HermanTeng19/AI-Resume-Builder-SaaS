import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft, Clock, ArrowUp } from 'lucide-react';
import { imageMap } from '../content/imageMap';
import { SEO } from '../components/SEO';

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
      let text = modules[path] as string;
      
      // Inject the cover image after the first "---" separator
      const imageUrl = slug ? imageMap[slug] : undefined;
      if (imageUrl) {
        const separator = '---';
        const splitIndex = text.indexOf(separator);
        if (splitIndex !== -1) {
          const before = text.substring(0, splitIndex + separator.length);
          const after = text.substring(splitIndex + separator.length);
          text = `${before}\n\n<img src="${imageUrl}" alt="Article Cover" class="blog-cover-image" />\n\n${after}`;
        }
      }
      
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

  const match = content.match(/^#\s+(.*)/m);
  const title = match ? match[1] : (slug ? slug.replace(/-/g, ' ') : 'Blog Post');
  
  // Extract summary for description if possible
  const paragraphMatch = content.match(/\n([A-Za-z].*?)\n/);
  const description = paragraphMatch ? paragraphMatch[1].slice(0, 150) + '...' : `Read ${title} on Career Insight Labs.`;

  return (
    <div className="blog-post-wrapper">
      <SEO 
        title={`${title} | Career Insight Labs`}
        description={description}
        url={`https://careerinsightlabs.com/blog/${slug}`}
      />
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
