import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft, Clock, Link as LinkIcon, Check, Mail } from 'lucide-react';

const RedditIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.56 12 8 12.56 8 13.25c0 .69.56 1.25 1.25 1.25s1.25-.56 1.25-1.25c0-.69-.56-1.25-1.25-1.25zm5.5 0c-.69 0-1.25.56-1.25 1.25 0 .69.56 1.25 1.25 1.25s1.25-.56 1.25-1.25c0-.69-.56-1.25-1.25-1.25zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .466c.843.84 2.486.914 2.947.914.461 0 2.104-.074 2.947-.914a.33.33 0 0 0 0-.466.327.327 0 0 0-.462 0c-.322.316-1.309.721-2.485.721-1.176 0-2.163-.405-2.485-.721a.327.327 0 0 0-.231-.094z"/>
  </svg>
);

const WhatsAppIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const XIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
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
        header = text.substring(0, splitIndex);
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
            <>
              <div className="blog-social-share">
                <div className="share-actions">
                  <button onClick={() => window.open(`mailto:?subject=${encodedTitle}&body=${encodedUrl}`, '_self')} aria-label="Share via Email">
                    <Mail size={16} />
                  </button>
                  <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank')} aria-label="Share on X">
                    <XIcon size={16} />
                  </button>
                  <button onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`, '_blank')} aria-label="Share on LinkedIn">
                    <LinkedinIcon size={16} />
                  </button>
                  <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')} aria-label="Share on Facebook">
                    <FacebookIcon size={16} />
                  </button>
                  <button onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`, '_blank')} aria-label="Share on WhatsApp">
                    <WhatsAppIcon size={16} />
                  </button>
                  <button onClick={() => window.open(`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`, '_blank')} aria-label="Share on Reddit">
                    <RedditIcon size={16} />
                  </button>
                  <button onClick={() => { handleCopy(); window.open('https://instagram.com', '_blank'); }} aria-label="Share on Instagram">
                    <InstagramIcon size={16} />
                  </button>
                  <button onClick={handleCopy} aria-label="Copy link" className={copied ? 'copied' : ''}>
                    {copied ? <Check size={16} /> : <LinkIcon size={16} />}
                  </button>
                </div>
              </div>
              <hr className="article-divider" />
            </>
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
