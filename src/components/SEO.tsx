import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  type?: string;
  name?: string;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = "Career Insight Labs - Free AI Resume Builder",
  description = "Bypass ATS algorithms and land interviews at top-tier companies with our privacy-first, free AI Resume Builder.",
  type = "website",
  name = "Career Insight Labs",
  url = "https://careerinsightlabs.com",
}) => {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph tags for social media sharing */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={name} />
      <meta property="og:image" content={`${url}/logo.png`} />

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${url}/logo.png`} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};
