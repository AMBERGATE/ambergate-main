import { Component, HostListener, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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

import { RouterLink } from '@angular/router';

import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-services3d',
  standalone: true,
  imports: [CommonModule, ServiceCardComponent, RouterLink],
  templateUrl: './services3d.component.html',
  styleUrl: './services3d.component.scss'
})
export class Services3dComponent implements OnInit, AfterViewInit {
  @ViewChild('cardsRow') cardsRow!: ElementRef<HTMLElement>;
  public activeSectionIndex: number = 0;
  public minDate: string = '';

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Ambergate USA | Selective Demolition & Commercial Services Miami',
      description: 'Especialistas en demolición selectiva de interiores, remoción de pisos y preparación de obra en Miami Beach y Florida. Ejecución rápida y precisa.',
      keywords: 'Demolición Comercial Miami, Selective Demolition Florida, Interior Strip Out, Demolición en Miami Beach, Floor Removal South Florida',
      ogType: 'website'
    });

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`;
  }

  // Lógica del Slider Antes / Después
  public sliderPosition: number = 50; // Porcentaje (0 a 100)
  public isDraggingSlider: boolean = false;

  // Selector de Tipo de Proyecto Personalizado
  public isProjectTypeOpen: boolean = false;
  public selectedProjectType: string = 'Selective Interior Demolition';
  public projectTypeOptions: string[] = [
    'Selective Interior Demolition',
    'Professional Flooring Removal',
    'High-Pressure Surface Washing',
    'Debris Removal & Site Logistics',
    'Turnkey Full-Service Solution'
  ];

  public toggleProjectTypeDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isProjectTypeOpen = !this.isProjectTypeOpen;
  }

  public selectProjectType(option: string, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedProjectType = option;
    this.isProjectTypeOpen = false;
  }

  // Modal de Catálogo Completo de Proyectos (Ambergate Luxury Gallery)
  public isAllProjectsModalOpen: boolean = false;
  public selectedCategoryFilter: string = 'all';

  public galleryCategories = [
    { id: 'all', label: 'ALL PROJECTS' },
    { id: 'SELECTIVE DEMOLITION', label: 'SELECTIVE DEMOLITION' },
    { id: 'INTERIOR DEMOLITION', label: 'INTERIOR DEMOLITION' },
    { id: 'SURFACES & SLAB', label: 'SURFACES & SLAB' },
    { id: 'POWER WASHING & LOGISTICS', label: 'POWER WASHING & LOGISTICS' }
  ];

  public get filteredProjects(): PortfolioProject[] {
    if (this.selectedCategoryFilter === 'all') {
      return this.portfolioProjects;
    }
    return this.portfolioProjects.filter(p => p.category === this.selectedCategoryFilter);
  }

  public getCategoryCount(catId: string): number {
    if (catId === 'all') {
      return this.portfolioProjects.length;
    }
    return this.portfolioProjects.filter(p => p.category === catId).length;
  }

  public openAllProjectsModal(): void {
    this.isAllProjectsModalOpen = true;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  public closeAllProjectsModal(): void {
    this.isAllProjectsModalOpen = false;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  public setCategoryFilter(catId: string): void {
    this.selectedCategoryFilter = catId;
  }

  public selectProjectFromModal(project: PortfolioProject): void {
    this.selectProject(project);
    this.closeAllProjectsModal();
    this.scrollToSection(4);
  }

  @HostListener('document:keydown.escape')
  public onEscapeKey(): void {
    if (this.isAllProjectsModalOpen) {
      this.closeAllProjectsModal();
    }
  }

  @HostListener('document:click')
  public closeDropdownsOnOutsideClick(): void {
    this.isProjectTypeOpen = false;
  }

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
      beforeImg: './assets/img/5-full/bde4fcd0-2ea8-4758-a73b-e57ff336b2d3.jpeg',
      afterImg: './assets/img/5-full/Gemini_Generated_Image_umz3k0umz3k0umz3 (1).jpeg',
      thumbnail: './assets/img/5-full/Gemini_Generated_Image_umz3k0umz3k0umz3 (1).jpeg'
    },
    {
      id: 'commercial-loft',
      title: 'Commercial Loft & Hospitality Strip-Out',
      category: 'INTERIOR DEMOLITION',
      location: 'Miami Beach, FL',
      details: 'Interior fixtures dismantling & structural slab cleanup • 32,000 sq ft',
      recordTime: 'Executed in 4 Days',
      beforeImg: './assets/img/1-interior-selective-demolitions/01.webp',
      afterImg: './assets/img/1-interior-selective-demolitions/03.webp',
      thumbnail: './assets/img/1-interior-selective-demolitions/03.webp'
    },
    {
      id: 'flooring-extraction',
      title: 'Industrial Flooring Extraction',
      category: 'SURFACES & SLAB',
      location: 'Fort Lauderdale, FL',
      details: 'High-output tile & carpet removal with HEPA prep • 28,000 sq ft',
      recordTime: 'Executed in 3 Days',
      beforeImg: './assets/img/2-flooring-demolition-removal/01.webp',
      afterImg: './assets/img/2-flooring-demolition-removal/02.webp',
      thumbnail: './assets/img/2-flooring-demolition-removal/02.webp'
    },
    {
      id: 'facility-reconditioning',
      title: 'Logistics Facility Reconditioning',
      category: 'POWER WASHING & LOGISTICS',
      location: 'West Palm Beach, FL',
      details: 'Industrial slab restoration & 4000+ PSI power wash • 60,000 sq ft',
      recordTime: 'Executed in 4 Days',
      beforeImg: './assets/img/3-high-pressure/01.webp',
      afterImg: './assets/img/3-high-pressure/02.webp',
      thumbnail: './assets/img/3-high-pressure/02.webp'
    }
  ];

  ngAfterViewInit(): void {
    const updateScroll = () => {
      if (this.cardsRow?.nativeElement) {
        this.checkScrollState(this.cardsRow.nativeElement);
      }
    };
    setTimeout(updateScroll, 100);
    setTimeout(updateScroll, 400);
    setTimeout(updateScroll, 1000);
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    if (this.cardsRow?.nativeElement) {
      this.checkScrollState(this.cardsRow.nativeElement);
    }
  }

  public selectedProject: PortfolioProject = this.portfolioProjects[0];
  public canScrollLeft: boolean = false;
  public canScrollRight: boolean = true;

  public checkScrollState(container: HTMLElement): void {
    if (!container) return;
    const maxScroll = container.scrollWidth - container.clientWidth;
    // Si no hay overflow (maxScroll <= 5px), asumir que no se puede scrollear a ningún lado
    if (maxScroll <= 5) {
      this.canScrollLeft = false;
      this.canScrollRight = false;
      return;
    }
    // Tolerancia de 10px para extrema precisión
    this.canScrollLeft = container.scrollLeft > 10;
    this.canScrollRight = container.scrollLeft < maxScroll - 10;
  }

  public scrollPortfolioCarousel(direction: 'left' | 'right'): void {
    const container = this.cardsRow?.nativeElement || (document.querySelector('.portfolio-cards-row') as HTMLElement);
    if (!container) return;
    const scrollAmount = 380;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
    // Verificar en múltiples intervalos durante el desplazamiento suave
    setTimeout(() => this.checkScrollState(container), 150);
    setTimeout(() => this.checkScrollState(container), 350);
    setTimeout(() => this.checkScrollState(container), 600);
  }

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

  public isProjectTypeHighlighted: boolean = false;

  public onQuoteRequested(serviceTitle?: string): void {
    if (serviceTitle) {
      const lower = serviceTitle.toLowerCase();
      if (lower.includes('interior')) {
        this.selectedProjectType = 'Selective Interior Demolition';
      } else if (lower.includes('flooring')) {
        this.selectedProjectType = 'Professional Flooring Removal';
      } else if (lower.includes('pressure') || lower.includes('washing')) {
        this.selectedProjectType = 'High-Pressure Surface Washing';
      } else if (lower.includes('debris') || lower.includes('logistics') || lower.includes('clearance')) {
        this.selectedProjectType = 'Debris Removal & Site Logistics';
      } else if (lower.includes('building') || lower.includes('turnkey') || lower.includes('full')) {
        this.selectedProjectType = 'Turnkey Full-Service Solution';
      }
    }

    this.scrollToSection(7);

    // Activar resplandor animado de confirmación en el selector
    this.isProjectTypeHighlighted = true;
    setTimeout(() => {
      this.isProjectTypeHighlighted = false;
    }, 2400);
  }

  public scrollToSection(index: number, optionName?: string): void {
    if (optionName) {
      this.selectedProjectType = optionName;
      this.isProjectTypeHighlighted = true;
      setTimeout(() => {
        this.isProjectTypeHighlighted = false;
      }, 2400);
    }
    this.activeSectionIndex = index;
    const targetElement = document.getElementById(`sec-${index}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

