import { Injectable } from '@angular/core';

export interface ProjectDetail {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  state: string;
  details: string;
  recordTime: string;
  thumbnail: string;
  beforeImg: string;
  afterImg: string;
  subtitle: string;
  caseStudyTitle: string;
  caseStudyDescription: string;
  specs: {
    category: string;
    location: string;
    state: string;
    rubros: string[];
  };
  gallery: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: ProjectDetail[] = [
    {
      id: 'retail-plaza',
      slug: 'commercial-demolition-retail-plaza',
      title: 'Commercial Demolition Retail Plaza',
      category: 'SELECTIVE DEMOLITION',
      location: 'Miami-Dade',
      state: 'Florida',
      details: 'Full commercial strip-out & dust containment • 45,000 sq ft',
      recordTime: 'Executed in 5 Days',
      thumbnail: './assets/img/5-full/Gemini_Generated_Image_umz3k0umz3k0umz3 (1).jpeg',
      beforeImg: './assets/img/5-full/bde4fcd0-2ea8-4758-a73b-e57ff336b2d3.jpeg',
      afterImg: './assets/img/5-full/Gemini_Generated_Image_umz3k0umz3k0umz3 (1).jpeg',
      subtitle: 'RENOVACIÓN COMERCIAL & DEMOLICIÓN DE INTERIORES',
      caseStudyTitle: 'DE ESPACIO OBSOLETO A PLAZA COMERCIAL DE ALTO TRÁFICO',
      caseStudyDescription: 'Desmantelamiento selectivo completo y aislamiento con tecnología HEPA 100% libre de polvo en espacio comercial de 45,000 sq ft. Trabajo ejecutado bajo estrictas normas de seguridad industrial en tiempo récord.',
      specs: {
        category: 'Demolición Selectiva / Comercio',
        location: 'Miami-Dade',
        state: 'Florida',
        rubros: [
          'Desmantelamiento Comercial',
          'Aislamiento de Polvo HEPA',
          'Retiro de Muros y Placas',
          'Gestión de Escombros y Reciclaje'
        ]
      },
      gallery: [
        './assets/img/5-full/Gemini_Generated_Image_umz3k0umz3k0umz3 (1).jpeg',
        './assets/img/5-full/bde4fcd0-2ea8-4758-a73b-e57ff336b2d3.jpeg'
      ]
    },
    {
      id: 'commercial-loft',
      slug: 'commercial-loft-hospitality-strip-out',
      title: 'Commercial Loft & Hospitality Strip-Out',
      category: 'INTERIOR DEMOLITION',
      location: 'Miami Beach',
      state: 'Florida',
      details: 'Interior fixtures dismantling & structural slab cleanup • 32,000 sq ft',
      recordTime: 'Executed in 4 Days',
      thumbnail: './assets/img/1-interior-selective-demolitions/03.webp',
      beforeImg: './assets/img/1-interior-selective-demolitions/01.webp',
      afterImg: './assets/img/1-interior-selective-demolitions/03.webp',
      subtitle: 'RESTRUCUTURACIÓN DE INTERIORES HOTELERA & LOFTS',
      caseStudyTitle: 'TRANSFORMACIÓN ESTRUCTURAL INTERIOR EN HOTEL DE LUJO',
      caseStudyDescription: 'Remoción técnica de mobiliario fijo, techos suspendidos e instalaciones obsoletas en 32,000 sq ft garantizando la integridad estructural del edificio original.',
      specs: {
        category: 'Interiorismo & Demolición',
        location: 'Miami Beach',
        state: 'Florida',
        rubros: [
          'Strip-Out Interior',
          'Limpieza de Losa Estructural',
          'Desmantelamiento Gastronómico',
          'Logística de Retiro Pesado'
        ]
      },
      gallery: [
        './assets/img/1-interior-selective-demolitions/01.webp',
        './assets/img/1-interior-selective-demolitions/03.webp',
        './assets/img/1-interior-selective-demolitions/04.webp'
      ]
    },
    {
      id: 'flooring-extraction',
      slug: 'industrial-flooring-extraction',
      title: 'Industrial Flooring Extraction',
      category: 'SURFACES & SLAB',
      location: 'Fort Lauderdale',
      state: 'Florida',
      details: 'High-output tile & carpet removal with HEPA prep • 28,000 sq ft',
      recordTime: 'Executed in 3 Days',
      thumbnail: './assets/img/2-flooring-demolition-removal/02.webp',
      beforeImg: './assets/img/2-flooring-demolition-removal/01.webp',
      afterImg: './assets/img/2-flooring-demolition-removal/02.webp',
      subtitle: 'REVESTIMIENTOS Y REMOCIÓN MECANIZADA DE PISOS',
      caseStudyTitle: 'EXTRACCIÓN MECANIZADA DE PISOS INDUSTRIALES Y PREPARACIÓN DE SUPERFICIE',
      caseStudyDescription: 'Remoción intensiva de 28,000 sq ft de epoxi y cerámicos industriales con maquinaria pesada y nivelación listos para nueva terminación.',
      specs: {
        category: 'Superficies & Pisos',
        location: 'Fort Lauderdale',
        state: 'Florida',
        rubros: [
          'Extracción de Cerámicos y Epoxi',
          'Preparación de Losa HEPA',
          'Desbastado Diamond Grinding',
          'Restauración de Juntas'
        ]
      },
      gallery: [
        './assets/img/2-flooring-demolition-removal/01.webp',
        './assets/img/2-flooring-demolition-removal/02.webp'
      ]
    },
    {
      id: 'facility-reconditioning',
      slug: 'logistics-facility-reconditioning',
      title: 'Logistics Facility Reconditioning',
      category: 'POWER WASHING & LOGISTICS',
      location: 'West Palm Beach',
      state: 'Florida',
      details: 'Industrial slab restoration & 4000+ PSI power wash • 60,000 sq ft',
      recordTime: 'Executed in 4 Days',
      thumbnail: './assets/img/3-high-pressure/02.webp',
      beforeImg: './assets/img/3-high-pressure/01.webp',
      afterImg: './assets/img/3-high-pressure/02.webp',
      subtitle: 'HIDROLAVADO INDUSTRIAL & DECONTAMINACIÓN',
      caseStudyTitle: 'REACONDICIONAMIENTO COMPLETO DE NAVE LOGÍSTICA',
      caseStudyDescription: 'Limpieza profunda a 4000+ PSI, desengrasado técnico y sellado de soleras en 60,000 sq ft para centro logístico de alta exigencia.',
      specs: {
        category: 'Lavado Industrial & Logística',
        location: 'West Palm Beach',
        state: 'Florida',
        rubros: [
          'Hidrolavado 4000+ PSI',
          'Descontaminación de Aceites',
          'Sellado de Microfisuras',
          'Pintura de Señalización'
        ]
      },
      gallery: [
        './assets/img/3-high-pressure/01.webp',
        './assets/img/3-high-pressure/02.webp',
        './assets/img/3-high-pressure/03.webp'
      ]
    }
  ];

  public getAllProjects(): ProjectDetail[] {
    return this.projects;
  }

  public getProjectBySlug(slug: string): ProjectDetail | undefined {
    return this.projects.find(p => p.slug === slug || p.id === slug);
  }

  public getAdjacentProjects(currentSlug: string): { prev?: ProjectDetail; next?: ProjectDetail } {
    const index = this.projects.findIndex(p => p.slug === currentSlug || p.id === currentSlug);
    if (index === -1) return {};
    const prev = this.projects[(index - 1 + this.projects.length) % this.projects.length];
    const next = this.projects[(index + 1) % this.projects.length];
    return { prev, next };
  }
}
