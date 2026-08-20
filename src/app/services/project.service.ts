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
      subtitle: 'COMMERCIAL RENOVATION & INTERIOR DEMOLITION',
      caseStudyTitle: 'FROM OBSOLETE SPACE TO HIGH-TRAFFIC COMMERCIAL PLAZA',
      caseStudyDescription: 'Full selective dismantling and 100% HEPA dust-free containment in a 45,000 sq ft commercial space. Executed under strict industrial safety standards in record time.',
      specs: {
        category: 'Selective Demolition / Commercial',
        location: 'Miami-Dade',
        state: 'Florida',
        rubros: [
          'Commercial Strip-Out',
          'HEPA Dust Containment',
          'Wall & Slab Removal',
          'Debris Management & Recycling'
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
      subtitle: 'HOSPITALITY & LOFT INTERIOR RESTRUCTURING',
      caseStudyTitle: 'INTERIOR STRUCTURAL TRANSFORMATION IN LUXURY HOTEL',
      caseStudyDescription: 'Technical removal of fixed furniture, suspended ceilings, and obsolete systems across 32,000 sq ft while safeguarding original building integrity.',
      specs: {
        category: 'Interior Design & Demolition',
        location: 'Miami Beach',
        state: 'Florida',
        rubros: [
          'Interior Strip-Out',
          'Structural Slab Cleanup',
          'Gastronomic Dismantling',
          'Heavy Removal Logistics'
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
      subtitle: 'COATINGS & MECHANIZED FLOOR REMOVAL',
      caseStudyTitle: 'MECHANIZED INDUSTRIAL FLOOR EXTRACTION & SURFACE PREPARATION',
      caseStudyDescription: 'Intensive removal of 28,000 sq ft of epoxy and industrial tiles using heavy machinery and precision levelling ready for new finishes.',
      specs: {
        category: 'Surfaces & Flooring',
        location: 'Fort Lauderdale',
        state: 'Florida',
        rubros: [
          'Ceramic & Epoxy Extraction',
          'HEPA Slab Preparation',
          'Diamond Grinding & Resurfacing',
          'Joint Restoration'
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
      subtitle: 'INDUSTRIAL POWER WASHING & DECONTAMINATION',
      caseStudyTitle: 'COMPLETE RECONDITIONING OF LOGISTICS WAREHOUSE',
      caseStudyDescription: 'Deep cleaning at 4000+ PSI, technical degreasing, and slab sealing across 60,000 sq ft for high-demanding logistics hubs.',
      specs: {
        category: 'Industrial Washing & Logistics',
        location: 'West Palm Beach',
        state: 'Florida',
        rubros: [
          '4000+ PSI Power Washing',
          'Oil & Chemical Decontamination',
          'Micro-crack Sealing',
          'Line Striping & Safety Paint'
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
