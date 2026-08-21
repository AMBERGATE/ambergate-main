import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ProjectService, ProjectDetail } from '../../services/project.service';

import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-projects-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './projects-catalog.component.html',
  styleUrl: './projects-catalog.component.scss'
})
export class ProjectsCatalogComponent implements OnInit {
  public selectedCategoryFilter: string = 'all';
  public portfolioProjects: ProjectDetail[] = [];

  public galleryCategories = [
    { id: 'all', label: 'ALL PROJECTS' },
    { id: 'SELECTIVE DEMOLITION', label: 'SELECTIVE DEMOLITION' },
    { id: 'INTERIOR DEMOLITION', label: 'INTERIOR / RETAIL' },
    { id: 'SURFACES & SLAB', label: 'FLOORING & SURFACES' },
    { id: 'POWER WASHING & LOGISTICS', label: 'HIGH-PRESSURE WASHING' }
  ];

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Portafolio de Demolición Comercial y Proyectos | Ambergate USA',
      description: 'Explora el catálogo de obras de demolición selectiva, strip-out interior y preparación de superficies ejecutadas por Ambergate USA en South Florida.',
      keywords: 'Portafolio Demolición Miami, Obras de Demolición Florida, Interior Strip Out, Demolición Comercial Ambergate',
      ogType: 'website'
    });

    this.portfolioProjects = this.projectService.getAllProjects();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  public get filteredProjects(): ProjectDetail[] {
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

  public inspectProject(proj: ProjectDetail): void {
    this.router.navigate(['/proyecto', proj.slug]);
  }
}
