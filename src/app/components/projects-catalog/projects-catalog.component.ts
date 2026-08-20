import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ProjectService, ProjectDetail } from '../../services/project.service';

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
    private router: Router
  ) {}

  ngOnInit(): void {
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
