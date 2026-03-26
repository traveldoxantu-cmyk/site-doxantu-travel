import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEO({ 
  title, 
  description, 
  image = 'https://doxantu-travel-agency.vercel.app/og-image.jpg', // Image par défaut
  url = window.location.href,
  type = 'website'
}: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} | Doxantu Travel`;
    document.title = fullTitle;
    
    // Helper function to update or create meta tags
    const updateOrCreateMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector);
      if (el) {
        el.setAttribute('content', content);
      } else {
        el = document.createElement('meta');
        if (property) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        el.setAttribute('content', content);
        document.head.appendChild(el);
      }
    };

    // Standard Meta Tags
    updateOrCreateMeta('description', description);

    // Open Graph / Facebook / WhatsApp
    updateOrCreateMeta('og:type', type, true);
    updateOrCreateMeta('og:url', url, true);
    updateOrCreateMeta('og:title', fullTitle, true);
    updateOrCreateMeta('og:description', description, true);
    updateOrCreateMeta('og:image', image, true);
    updateOrCreateMeta('og:image:alt', title, true);

    // Twitter
    updateOrCreateMeta('twitter:card', 'summary_large_image');
    updateOrCreateMeta('twitter:url', url);
    updateOrCreateMeta('twitter:title', fullTitle);
    updateOrCreateMeta('twitter:description', description);
    updateOrCreateMeta('twitter:image', image);
    updateOrCreateMeta('twitter:image:alt', title);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', url);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', url);
      document.head.appendChild(canonical);
    }
  }, [title, description, image, url, type]);

  return null;
}
