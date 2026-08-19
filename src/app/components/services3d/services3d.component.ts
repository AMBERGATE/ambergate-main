import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceCardComponent, ServiceItemData } from '../service-card/service-card.component';

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  location: string;
  details: string;
  recordTime: string;
  beforeImg: string;
  afterImg: string;
  thumbnail: string;
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

  // Lógica del Slider Antes / Después
  public sliderPosition: number = 50; // Porcentaje (0 a 100)
  public isDraggingSlider: boolean = false;

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
      id: 'retail-plaza',
      title: 'Commercial Demolition Retail Plaza',
      category: 'SELECTIVE DEMOLITION',
      location: 'Miami-Dade, FL',
      details: 'Full commercial strip-out & dust containment • 45,000 sq ft',
      recordTime: 'Executed in 5 Days',
      beforeImg: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1400&q=85',
      afterImg: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=85',
      thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'flooring-extraction',
      title: 'Industrial Flooring Extraction',
      category: 'SURFACES & SLAB',
      location: 'Fort Lauderdale, FL',
      details: 'High-output tile & carpet removal with HEPA prep • 28,000 sq ft',
      recordTime: 'Executed in 3 Days',
      beforeImg: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1400&q=85',
      afterImg: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=85',
      thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'facility-reconditioning',
      title: 'Logistics Facility Reconditioning',
      category: 'POWER WASHING & LOGISTICS',
      location: 'West Palm Beach, FL',
      details: 'Industrial slab restoration & 4000+ PSI power wash • 60,000 sq ft',
      recordTime: 'Executed in 4 Days',
      beforeImg: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=85',
      afterImg: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85',
      thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'
    }
  ];

  public selectedProject: PortfolioProject = this.portfolioProjects[0];

  public selectProject(project: PortfolioProject): void {
    this.selectedProject = project;
    this.sliderPosition = 50; // Resetea a la mitad al cambiar de obra
  }

  public onSliderInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.sliderPosition = parseFloat(input.value);
  }

  public startSliderDrag(event: MouseEvent | TouchEvent): void {
    this.isDraggingSlider = true;
    this.updateSliderPositionFromEvent(event);
  }

  public stopSliderDrag(): void {
    this.isDraggingSlider = false;
  }

  public onSliderMove(event: MouseEvent | TouchEvent): void {
    if (!this.isDraggingSlider) return;
    this.updateSliderPositionFromEvent(event);
  }

  private updateSliderPositionFromEvent(event: MouseEvent | TouchEvent): void {
    const container = (event.currentTarget as HTMLElement) || (event.target as HTMLElement).closest('.before-after-container');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const offsetX = clientX - rect.left;
    let percentage = (offsetX / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    this.sliderPosition = percentage;
  }

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

