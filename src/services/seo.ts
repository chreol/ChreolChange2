// src/services/seo.ts
export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
}

export const SEOService = {
  defaults: {
    title: 'CHREOL EMPIRE — Change EUR ↔ FCFA | Rapide, Sécurisé, 24/7 depuis la Grèce',
    description: 'Service de change EUR/FCFA fiable depuis Athènes. 1€ = 650 FCFA — Commission 3€/100€. Envoi en ≥5 min vers le Cameroun et toute l\'Afrique. MTN MoMo, Orange Money, Virement IBAN, PayPal, ZEN.',
    keywords: ['change eur cfa', 'change eur fcfa', 'transfert argent afrique', 'mobile money', 'MTN MoMo', 'orange money', 'taux de change', 'envoi argent cameroun', 'senegal', 'cote d\'ivoire', 'chreol empire', 'grèce afrique', 'virement iban', 'paypal', 'ZEN bank'],
    image: 'https://chreol.github.io/ChreolChangeMoney/og-image.jpg',
    type: 'website' as const,
  },

  setTitle(title: string): void {
    document.title = title;
    this.updateMeta('og:title', title);
    this.updateMeta('twitter:title', title);
  },

  setDescription(description: string): void {
    this.updateMeta('description', description, true);
    this.updateMeta('og:description', description);
    this.updateMeta('twitter:description', description);
  },

  setCanonical(url: string): void {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
  },

  updateMeta(property: string, content: string, nameAttr = false): void {
    let meta = document.querySelector(`meta[${nameAttr ? 'name' : 'property'}="${property}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      if (nameAttr) {
        meta.name = property;
      } else {
        meta.setAttribute('property', property);
      }
      document.head.appendChild(meta);
    }
    meta.content = content;
  },

  addStructuredData(data: Record<string, unknown>): void {
    // Supprimer les anciens scripts JSON-LD dynamiques pour éviter les doublons
    document.querySelectorAll('script[type="application/ld+json"][data-dynamic="true"]').forEach(el => el.remove());
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-dynamic', 'true');
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  },

  init(config: Partial<SEOConfig> = {}): void {
    const final = { ...this.defaults, ...config };
    
    // Meta de base
    this.setTitle(final.title);
    this.setDescription(final.description);
    
    // Keywords
    if (final.keywords?.length) {
      this.updateMeta('keywords', final.keywords.join(', '), true);
    }
    
    // Open Graph
    this.updateMeta('og:type', final.type || 'website');
    this.updateMeta('og:site_name', 'CHREOL EMPIRE');
    this.updateMeta('og:locale', 'fr_FR');
    if (final.image) {
      this.updateMeta('og:image', final.image);
      this.updateMeta('og:image:width', '1200');
      this.updateMeta('og:image:height', '630');
      this.updateMeta('twitter:image', final.image);
    }
    
    // Twitter Card
    this.updateMeta('twitter:card', 'summary_large_image');
    this.updateMeta('twitter:site', '@ChreolEmpire');
    
    // Canonical
    if (final.canonical) {
      this.setCanonical(final.canonical);
    }
    
    // Structured Data JSON-LD principal
    this.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'FinancialService',
      name: 'CHREOL EMPIRE Change-Money',
      description: final.description,
      url: final.canonical || window.location.origin,
      telephone: '+306973598677',
      priceRange: '€€',
      currenciesAccepted: 'EUR,XOF',
      paymentAccepted: 'Cash,Mobile Money,Bank Transfer,PayPal',
      areaServed: ['GR', 'CI', 'SN', 'ML', 'BF', 'TG', 'BJ', 'NE'],
      openingHours: 'Mo-Su 08:00-22:00',
      sameAs: [
        'https://wa.me/306973598677',
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '127',
      }
    });

    // FAQ Structured Data (si des éléments FAQ existent dans le DOM)
    this.addFAQStructuredData();
  },

  addFAQStructuredData(): void {
    const faqItems = document.querySelectorAll('.faq-item[itemscope]');
    if (!faqItems.length) return;

    const faqData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: Array.from(faqItems).map((item) => {
        const nameEl = item.querySelector('[itemprop="name"]');
        const textEl = item.querySelector('[itemprop="text"]');
        return {
          '@type': 'Question',
          name: nameEl?.textContent?.trim() || '',
          acceptedAnswer: {
            '@type': 'Answer',
            text: textEl?.textContent?.trim() || '',
          }
        };
      })
    };

    this.addStructuredData(faqData);
  },

  addLocalBusinessData(): void {
    this.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'CHREOL EMPIRE Change-Money',
      image: this.defaults.image,
      '@id': `${window.location.origin}#business`,
      url: window.location.origin,
      telephone: '+306973598677',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Athènes',
        addressCountry: 'GR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 37.9838,
        longitude: 23.7275,
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
        opens: '08:00',
        closes: '22:00',
      },
      priceRange: '€€',
    });
  }
};