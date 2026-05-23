import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Title, Meta, Link as HeadLink } from 'react-head';

/**
 * 🔥 SEOHelmet — Updated for react-head
 * - Same props API as before
 * - Works with React 19 & Router v7
 * - Inserts <title>, <meta>, <link> tags into <head>
 * - Supports OG, Twitter, canonical & custom meta
 */
const SEOHelmet = memo(({
  title,
  description,
  keywords,
  author = 'Your Company Name',
  ogType = 'website',
  ogImage,
  ogUrl,
  canonicalUrl,
  lang = 'en',
  meta = [],
  links = []
}) => {
  const baseUrl = import.meta.env.VITE_BASE_URL || 'https://yourwebsite.com';

  const fullOgUrl = ogUrl ? new URL(ogUrl, baseUrl).toString() : baseUrl;
  const fullOgImage = ogImage ? new URL(ogImage, baseUrl).toString() : null;
  const fullCanonicalUrl = canonicalUrl
    ? new URL(canonicalUrl, baseUrl).toString()
    : fullOgUrl;

  return (
    <>
      {/* HTML lang attribute */}
      <Meta httpEquiv="content-language" content={lang} />

      {/* Title */}
      <Title>{`${title} | App Name`}</Title>

      {/* Primary Meta */}
      <Meta name="description" content={description} />
      {keywords && <Meta name="keywords" content={keywords} />}
      <Meta name="author" content={author} />

      {/* OG Meta */}
      <Meta property="og:title" content={title} />
      <Meta property="og:description" content={description} />
      <Meta property="og:type" content={ogType} />
      <Meta property="og:url" content={fullOgUrl} />

      {/* Twitter */}
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" content={title} />
      <Meta name="twitter:description" content={description} />

      {/* OG + Twitter Images */}
      {fullOgImage && (
        <>
          <Meta property="og:image" content={fullOgImage} />
          <Meta name="twitter:image" content={fullOgImage} />
        </>
      )}

      {/* Custom meta passed as array */}
      {meta.filter(Boolean).map((m, i) => (
        <Meta key={i} {...m} />
      ))}

      {/* Canonical URL */}
      <HeadLink rel="canonical" href={fullCanonicalUrl} />

      {/* Additional links */}
      {links.map((ln, i) => (
        <HeadLink key={i} {...ln} />
      ))}
    </>
  );
});

SEOHelmet.displayName = 'SEOHelmet';

SEOHelmet.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  keywords: PropTypes.string,
  author: PropTypes.string,
  ogType: PropTypes.string,
  ogImage: PropTypes.string,
  ogUrl: PropTypes.string,
  canonicalUrl: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      content: PropTypes.string,
      property: PropTypes.string,
    })
  ),
  links: PropTypes.arrayOf(
    PropTypes.shape({
      rel: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    })
  ),
};

export default SEOHelmet;
