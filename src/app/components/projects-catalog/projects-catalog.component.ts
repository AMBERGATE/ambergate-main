import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioProject } from '../services3d/services3d.component';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-projects-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './projects-catalog.component.html',
  styleUrl: './projects-catalog.component.scss'
})
export class ProjectsCatalogComponent implements OnInit {
  public selectedCategoryFilter: string = 'all';

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

  public galleryCategories = [
    { id: 'all', label: 'TODAS' },
    { id: 'SELECTIVE DEMOLITION', label: 'DEMOLICIÓN SELECTIVA' },
    { id: 'INTERIOR DEMOLITION', label: 'INTERIOR / TIENDAS' },
    { id: 'SURFACES & SLAB', label: 'PISOS & SUPERFICIES' },
    { id: 'POWER WASHING & LOGISTICS', label: 'LAVADO ALTA PRESIÓN' }
  ];

  public activeInspectionProject: PortfolioProject | null = null;
  public inspectSliderPosition: number = 50;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

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

  public setCategoryFilter(catId: string): void {
    this.selectedCategoryFilter = catId;
  }

  public inspectProject(proj: PortfolioProject): void {
    this.activeInspectionProject = proj;
    this.inspectSliderPosition = 50;
  }

  public closeInspection(): void {
    this.activeInspectionProject = null;
  }

  public onInspectSliderInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.inspectSliderPosition = parseFloat(input.value);
  }
}
