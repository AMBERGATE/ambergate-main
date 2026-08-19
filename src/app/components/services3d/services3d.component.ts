import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceCardComponent, ServiceItemData } from '../service-card/service-card.component';

export interface PortfolioProject {
  title: string;
  category: string;
  location: string;
  squareFeet: string;
  recordTime: string;
  imageUrl: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface BrandPartner {
  name: string;
  tagline: string;
}

@Component({
  selector: 'app-services3d',
  standalone: true,
  imports: [CommonModule, ServiceCardComponent],
  templateUrl: './services3d.component.html',
  styleUrl: './services3d.component.scss'
})
export class Services3dComponent {
  public activeSectionIndex: number = 0;

  public servicesList: ServiceItemData[] = [
    {
      step: '01 / 04',
      badge: 'SELECTIVE DEMOLITION',
      title: 'Selective Interior Demolition',
      description: 'Specialized precision indoor demolition teams for commercial and industrial spaces. Controlled structural dismantling, strict protection of MEP systems, and full dust containment.',
      stat1Value: '100%',
      stat1Label: 'Technical Precision',
      stat2Value: 'Zero Impact',
      stat2Label: 'Structural Safety',
      tags: ['Commercial Strip-Out', 'MEP Preservation', 'Clean Dismantling'],
      cubeColor: 0xDBA622,
      shapeType: 'block-assembly'
    },
    {
      step: '02 / 04',
      badge: 'SURFACE SPECIALISTS',
      title: 'Professional Flooring Removal',
      description: 'High-output industrial machinery for rapid tile, carpet, VCT, and subfloor prep. We reduce traditional removal timelines by up to 90% with integrated HEPA filtration.',
      stat1Value: '90%',
      stat1Label: 'Time Saved',
      stat2Value: 'HEPA',
      stat2Label: 'Continuous Air Filter',
      tags: ['Tile Extraction', 'Adhesive Grinding', 'Slab Prep'],
      cubeColor: 0x10B981,
      shapeType: 'layered-slab'
    },
    {
      step: '03 / 04',
      badge: 'SURFACE RESTORATION',
      title: 'High-Pressure Power Washing',
      description: 'Heavy-duty industrial pressure washing service (4000+ PSI). Deep removal of industrial oils, paint, grease deposits, and exterior surface prep for re-tenanting.',
      stat1Value: '4000+',
      stat1Label: 'PSI Power',
      stat2Value: 'Eco',
      stat2Label: 'Certified Wash',
      tags: ['Slab Scrubbing', 'Exterior Prep', 'Oil Removal'],
      cubeColor: 0xDBA622,
      shapeType: 'hydro-crystal'
    },
    {
      step: '04 / 04',
      badge: 'SITE LOGISTICS',
      title: 'Debris Removal & Site Clearance',
      description: 'Rapid dispatch and hauling of construction debris, demolition waste, and thorough site cleanup. Guaranteed compliance with OSHA and LEED environmental standards.',
      stat1Value: '24/7',
      stat1Label: 'Fleet Dispatch',
      stat2Value: 'LEED',
      stat2Label: 'Certified Recycling',
      tags: ['Debris Hauling', 'Heavy Fleet', 'OSHA Clean'],
      cubeColor: 0xF59E0B,
      shapeType: 'logistics-matrix'
    }
  ];

  public portfolioProjects: PortfolioProject[] = [
    {
      title: 'Commercial Demolition Retail Plaza',
      category: 'Selective Demolition',
      location: 'Miami-Dade, FL',
      squareFeet: '45,000 sq ft',
      recordTime: 'Executed in 5 Days',
      imageUrl: 'assets/img/service-1.jpg'
    },
    {
      title: 'Industrial Flooring Extraction',
      category: 'Surfaces & Slab',
      location: 'Fort Lauderdale, FL',
      squareFeet: '28,000 sq ft',
      recordTime: 'Executed in 3 Days',
      imageUrl: 'assets/img/service-2.jpg'
    },
    {
      title: 'Logistics Facility Reconditioning',
      category: 'Power Washing & Logistics',
      location: 'West Palm Beach, FL',
      squareFeet: '60,000 sq ft',
      recordTime: 'Executed in 4 Days',
      imageUrl: 'assets/img/service-3.jpg'
    }
  ];

  public processSteps: ProcessStep[] = [
    {
      number: '01',
      title: 'Strategic Planning',
      subtitle: 'Assessment & Logistics',
      description: 'Pre-site inspection, mapping of MEP structures to preserve, and safety protocol design.'
    },
    {
      number: '02',
      title: 'On-Site Execution',
      subtitle: 'Crews & Heavy Machinery',
      description: 'Immediate deployment of certified crews and proprietary heavy machinery without delay.'
    },
    {
      number: '03',
      title: 'Efficient Logistics',
      subtitle: 'Containment & Hauling',
      description: 'Hermetic 100% HEPA dust isolation and continuous debris hauling using company-owned containers.'
    },
    {
      number: '04',
      title: 'Certified Handover',
      subtitle: 'Construction-Ready Site',
      description: 'Final quality inspection and 100% clean site certification ready for immediate build-out.'
    }
  ];

  public brandPartners: BrandPartner[] = [
    { name: 'PUMA ENERGY', tagline: 'Commercial Networks' },
    { name: 'CENCOSUD', tagline: 'Retail Outlets' },
    { name: 'DEAN & DENNYS', tagline: 'Hospitality & Dining' },
    { name: 'SUBWAY', tagline: 'Franchise Locations' },
    { name: 'FAN DE PAN', tagline: 'Commercial Chains' }
  ];

  public integralShowcaseData: ServiceItemData = {
    step: 'COMPLETE LIFECYCLE',
    badge: 'TURNKEY EXECUTION',
    title: 'End-to-End Building Demolition',
    description: 'Real-time 3D simulation of a complete commercial building demolition, from initial structural evaluation and hazardous strip-out to final clear slab handover.',
    stat1Value: '100%',
    stat1Label: 'Turnkey Delivery',
    stat2Value: '0%',
    stat2Label: 'Site Friction',
    tags: ['Full Building Strip', 'Civil Debris Hauling', 'Final Site Handoff'],
    cubeColor: 0xDBA622,
    shapeType: 'block-assembly',
    modelPath: '/assets/models/amber_service_model_3.glb'
  };

  public scrollToSection(index: number): void {
    this.activeSectionIndex = index;
    const targetElement = document.getElementById(`sec-${index}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

