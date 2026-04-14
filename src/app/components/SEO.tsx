import { useEffect } from 'react';
import { JsonLd } from './JsonLd';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEO({ 
  title, 
  description, 
  keywords = 'Doxantu Travel, agence voyage Sénégal, Campus France Sénégal, visa Canada Sénégal, mobilité étudiante, billets avion Dakar',
  image = 'https://doxantu-travel-agency.vercel.app/og-image.jpg',
  url = window.location.href,
  type = 'website'
}: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} | Doxantu Travel`;
    document.title = fullTitle;
    
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

    updateOrCreateMeta('description', description);
    updateOrCreateMeta('keywords', keywords);

    updateOrCreateMeta('og:type', type, true);
    updateOrCreateMeta('og:url', url, true);
    updateOrCreateMeta('og:title', fullTitle, true);
    updateOrCreateMeta('og:description', description, true);
    updateOrCreateMeta('og:image', image, true);
    updateOrCreateMeta('og:image:alt', title, true);

    updateOrCreateMeta('twitter:card', 'summary_large_image');
    updateOrCreateMeta('twitter:url', url);
    updateOrCreateMeta('twitter:title', fullTitle);
    updateOrCreateMeta('twitter:description', description);
    updateOrCreateMeta('twitter:image', image);
    updateOrCreateMeta('twitter:image:alt', title);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', url);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', url);
      document.head.appendChild(canonical);
    }
  }, [title, description, keywords, image, url, type]);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Doxantu Travel",
    "alternateName": "Doxantu Travel Agency",
    "url": "https://doxantu-travel-agency.vercel.app",
    "logo": "https://doxantu-travel-agency.vercel.app/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+221776748596",
      "contactType": "customer service",
      "areaServed": "SN",
      "availableLanguage": ["French", "Wolof"]
    },
    "sameAs": [
      "https://www.instagram.com/doxantutravel",
      "https://www.tiktok.com/@doxantu.travel"
    ]
  };

  return <JsonLd data={organizationSchema} />;
}
