import { SEOService, type SEOConfig } from '@/services/seo';

export class SEOHead {
  /**
   * Injecte les balises SEO dans le <head> du document
   * @param config - Configuration SEO partielle (surcharge les valeurs par défaut)
   */
  static inject(config: Partial<SEOConfig> = {}): void {
    // Initialiser avec les valeurs par défaut + surcharges
    SEOService.init(config);
    
    // Préchargement des ressources critiques
    this.preloadCriticalResources();
    
    // DNS prefetch pour les domaines externes
    this.addDNSPrefetch();
    
    // Préconnexion aux domaines critiques
    this.addPreconnect();
  }

  /**
   * Précharge les ressources critiques pour améliorer le LCP
   */
  private static preloadCriticalResources(): void {
    const resources: Array<{ href: string; as: RequestDestination; type?: string }> = [
      { href: '/icons/icon-192x192.png', as: 'image', type: 'image/png' },
      { href: '/icons/icon-512x512.png', as: 'image', type: 'image/png' },
      { href: '/src/styles/main.css', as: 'style' },
      { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', as: 'style' },
    ];
    
    resources.forEach(({ href, as, type }) => {
      // Éviter de précharger deux fois la même ressource
      if (document.querySelector(`link[rel="preload"][href="${href}"]`)) {
        return;
      }

      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      
      // ✅ FIX: crossOrigin attend 'anonymous' | 'use-credentials' | null
      // Pas de 'undefined' qui cause l'erreur TypeScript
      if (as === 'image' || as === 'font') {
        link.crossOrigin = 'anonymous';
      } else {
        link.crossOrigin = null;
      }
      
      if (type) {
        link.setAttribute('type', type);
      }
      
      document.head.appendChild(link);
    });
  }

  /**
   * Ajoute les balises dns-prefetch pour accélérer la résolution DNS
   */
  private static addDNSPrefetch(): void {
    const domains = [
      'wa.me',
      'api.whatsapp.com',
      'fonts.googleapis.com',
      'fonts.gstatic.com',
    ];
    
    domains.forEach((domain) => {
      // Éviter les doublons
      if (document.querySelector(`link[rel="dns-prefetch"][href="https://${domain}"]`)) {
        return;
      }
      
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `https://${domain}`;
      document.head.appendChild(link);
    });
  }

  /**
   * Ajoute les balises preconnect pour établir des connexions précoces
   */
  private static addPreconnect(): void {
    const domains = [
      { href: 'https://fonts.googleapis.com', crossorigin: true },
      { href: 'https://fonts.gstatic.com', crossorigin: true },
      { href: 'https://wa.me', crossorigin: false },
    ];
    
    domains.forEach(({ href, crossorigin }) => {
      // Éviter les doublons
      if (document.querySelector(`link[rel="preconnect"][href="${href}"]`)) {
        return;
      }
      
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = href;
      
      // ✅ FIX: Même correction pour preconnect
      link.crossOrigin = crossorigin ? 'anonymous' : null;
      
      document.head.appendChild(link);
    });
  }

  /**
   * Met à jour dynamiquement les métadonnées pour le référencement
   * Utile pour les pages dynamiques ou le routage client-side
   */
  static updatePageMetadata({
    title,
    description,
    canonical,
    keywords,
  }: {
    title?: string;
    description?: string;
    canonical?: string;
    keywords?: string[];
  }): void {
    if (title) {
      document.title = title;
      SEOService.updateMeta('og:title', title);
      SEOService.updateMeta('twitter:title', title);
    }
    
    if (description) {
      SEOService.updateMeta('description', description, true);
      SEOService.updateMeta('og:description', description);
      SEOService.updateMeta('twitter:description', description);
    }
    
    if (canonical) {
      SEOService.setCanonical(canonical);
    }
    
    if (keywords?.length) {
      SEOService.updateMeta('keywords', keywords.join(', '), true);
    }
  }

  /**
   * Génère et injecte le JSON-LD pour les breadcrumbs (optionnel)
   */
  static injectBreadcrumbs(items: Array<{ name: string; url: string }>): void {
    const breadcrumbData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };
    
    SEOService.addStructuredData(breadcrumbData);
  }

  /**
   * Nettoie les balises SEO dynamiques (utile pour les SPA)
   */
  static cleanup(): void {
    // Supprimer les JSON-LD dynamiques injectés précédemment
    document.querySelectorAll('script[type="application/ld+json"][data-dynamic="true"]').forEach((el) => {
      el.remove();
    });
  }
}