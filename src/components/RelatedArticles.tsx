import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getRelatedArticles } from '../utils/articleUtils';
import { imageMap } from '../content/imageMap';

const modules = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default', eager: true });
const defaultImages = Object.values(imageMap);

interface RelatedArticlesProps {
  currentSlug: string;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ currentSlug }) => {
  const relatedArticles = useMemo(() => {
    const allArticles = Object.keys(modules).map((path) => {
      const slug = path.split('/').pop()?.replace('.md', '') || '';
      const content = modules[path] as string;
      const match = content.match(/^#\s+(.*)/m);
      const title = match ? match[1] : slug;
      
      const dateMatch = content.match(/<br\/>(.*?)\*/);
      const dateStr = dateMatch ? dateMatch[1].trim() : 'Unknown';

      const words = content.trim().split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(words / 200));

      let image = imageMap[slug];
      if (!image) {
        const hash = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        image = defaultImages[hash % defaultImages.length];
      }
      
      return { slug, title, image, dateStr, readingTime };
    });

    return getRelatedArticles(currentSlug, allArticles, 3);
  }, [currentSlug]);

  if (relatedArticles.length === 0) return null;

  return (
    <div className="related-articles-container">
      <h3 className="related-heading">Keep Reading</h3>
      <div className="related-grid">
        {relatedArticles.map((article) => (
          <Link to={`/blog/${article.slug}`} key={article.slug} className="related-card">
            <img src={article.image} alt={article.title} className="related-img" />
            <div className="related-info">
              <h4 className="related-title">{article.title}</h4>
              <div className="related-meta">
                <span>{article.dateStr}</span> &bull; <span>{article.readingTime} min read</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;
