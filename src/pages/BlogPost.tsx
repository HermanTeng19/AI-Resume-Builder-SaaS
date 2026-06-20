import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft, Clock, Link as LinkIcon, Check } from 'lucide-react';

const LinkedinIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const TwitterIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const FacebookIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);
import { imageMap } from '../content/imageMap';
import { SEO } from '../components/SEO';

const modules = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default', eager: true });

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState('');
  const [headerContent, setHeaderContent] = useState('');
  const [bodyContent, setBodyContent] = useState('');
  const [readingTime, setReadingTime] = useState(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Always start reading from the top
    const path = `../content/blog/${slug}.md`;
    if (modules[path]) {
      let text = modules[path] as string;
      
      let header = '';
      let body = '';

      // Inject the cover image after the first "---" separator
      const imageUrl = slug ? imageMap[slug] : undefined;
      const separator = '---';
      const splitIndex = text.indexOf(separator);
      
      if (splitIndex !== -1) {
        header = text.substring(0, splitIndex + separator.length);
        body = text.substring(splitIndex + separator.length);
        if (imageUrl) {
          body = `\n\n<img src="${imageUrl}" alt="Article Cover" class="blog-cover-image" />\n\n${body}`;
        }
      } else {
        if (imageUrl) {
          text = `<img src="${imageUrl}" alt="Article Cover" class="blog-cover-image" />\n\n${text}`;
        }
      }
      
      setContent(text);
      setHeaderContent(header);
      setBodyContent(body);
      
      // Simple reading time calculation (approx 200 words per minute)
      const words = text.trim().split(/\s+/).length;
      setReadingTime(Math.max(1, Math.ceil(words / 200)));
    } else {
      setContent('# Article not found\n\nSorry, the article you are looking for does not exist.');
    }
  }, [slug]);

  const match = content.match(/^#\s+(.*)/m);
  const title = match ? match[1] : (slug ? slug.replace(/-/g, ' ') : 'Blog Post');
  
  // Extract summary for description if possible
  const paragraphMatch = content.match(/\n([A-Za-z].*?)\n/);
  const description = paragraphMatch ? paragraphMatch[1].slice(0, 150) + '...' : `Read ${title} on Career Insight Labs.`;

  const shareUrl = `https://careerinsightlabs.com/blog/${slug}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          {headerContent && (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
            >
              {headerContent}
            </ReactMarkdown>
          )}

          {headerContent && (
            <div className="blog-social-share">
              <span className="share-label">Share this article</span>
              <div className="share-actions">
                <button onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`, '_blank')} aria-label="Share on LinkedIn">
                  <LinkedinIcon size={18} />
                </button>
                <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank')} aria-label="Share on Twitter">
                  <TwitterIcon size={18} />
                </button>
                <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')} aria-label="Share on Facebook">
                  <FacebookIcon size={18} />
                </button>
                <button onClick={handleCopy} aria-label="Copy link" className={copied ? 'copied' : ''}>
                  {copied ? <Check size={18} /> : <LinkIcon size={18} />}
                </button>
              </div>
            </div>
          )}

          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeRaw]}
          >
            {bodyContent ? bodyContent : content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
