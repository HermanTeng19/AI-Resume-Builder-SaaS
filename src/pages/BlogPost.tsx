import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft, Clock, Twitter, Linkedin, Facebook, Link as LinkIcon, Check } from 'lucide-react';
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
                  <Linkedin size={18} />
                </button>
                <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank')} aria-label="Share on Twitter">
                  <Twitter size={18} />
                </button>
                <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')} aria-label="Share on Facebook">
                  <Facebook size={18} />
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
