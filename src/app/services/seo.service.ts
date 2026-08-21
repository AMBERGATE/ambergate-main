import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  schemaJson?: any;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly defaultBaseUrl = 'https://ambergateusa.com'; // Dominio final principal
  private readonly defaultOgImage = 'https://ambergateusa.com/assets/img/og-ambergate.jpg';

  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  public updateSeo(config: SeoConfig): void {
    // 1. Título de la pestaña
    this.titleService.setTitle(config.title);

    // 2. Metadatos básicos
    this.metaService.updateTag({ name: 'description', content: config.description });
    if (config.keywords) {
      this.metaService.updateTag({ name: 'keywords', content: config.keywords });
    }

    // 3. Open Graph (Para Facebook, WhatsApp, LinkedIn, etc.)
    this.metaService.updateTag({ property: 'og:title', content: config.title });
    this.metaService.updateTag({ property: 'og:description', content: config.description });
    this.metaService.updateTag({ property: 'og:type', content: config.ogType || 'website' });
    this.metaService.updateTag({ property: 'og:image', content: config.ogImage || this.defaultOgImage });
    
    const currentUrl = config.ogUrl || (isPlatformBrowser(this.platformId) ? window.location.href : this.defaultBaseUrl);
    this.metaService.updateTag({ property: 'og:url', content: currentUrl });

    // 4. Twitter Cards
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: config.title });
    this.metaService.updateTag({ name: 'twitter:description', content: config.description });
    this.metaService.updateTag({ name: 'twitter:image', content: config.ogImage || this.defaultOgImage });

    // 5. Canonical Link
    this.updateCanonicalUrl(currentUrl);

    // 6. Schema.org JSON-LD Structuring
    if (config.schemaJson) {
      this.injectSchemaJson(config.schemaJson);
    } else {
      this.injectDefaultLocalBusinessSchema();
    }
  }

  private updateCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector("link[rel='canonical']");
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private injectSchemaJson(schemaData: any): void {
    let scriptElement: HTMLScriptElement | null = this.document.querySelector("script[type='application/ld+json']");
    if (!scriptElement) {
      scriptElement = this.document.createElement('script');
      scriptElement.setAttribute('type', 'application/ld+json');
      this.document.head.appendChild(scriptElement);
    }
    scriptElement.textContent = JSON.stringify(schemaData);
  }

  public injectDefaultLocalBusinessSchema(): void {
    const defaultSchema = {
      "@context": "https://schema.org",
      "@type": "GeneralContractor",
      "name": "Ambergate USA",
      "image": this.defaultOgImage,
      "@id": "https://ambergateusa.com/",
      "url": "https://ambergateusa.com/",
      "telephone": "+1-305-555-0123",
      "priceRange": "$$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "7017 Trouville Esplanade",
        "addressLocality": "Miami Beach",
        "addressRegion": "FL",
        "postalCode": "33141",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 25.8573,
        "longitude": -80.1302
      },
      "areaServed": [
        "Miami Beach",
        "Miami",
        "Fort Lauderdale",
        "South Florida",
        "Brickell"
      ],
      "sameAs": [
        "https://www.instagram.com/ambergateusa",
        "https://www.linkedin.com/company/ambergate-usa"
      ]
    };

    this.injectSchemaJson(defaultSchema);
  }
}
