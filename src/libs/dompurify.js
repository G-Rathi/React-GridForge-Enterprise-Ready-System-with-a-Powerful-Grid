import DOMPurify from 'dompurify';

export const sanitizeHtml = (dirty) => {
  return DOMPurify.sanitize(dirty);
}; // HTML allow kre but safe

export const sanitizeUrl = (url) => {
  return DOMPurify.sanitize(url, { ALLOWED_TAGS: [] });
}; // risky URL block kare

export const stripTags = (html) => {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
}; // sirf text chahiye
