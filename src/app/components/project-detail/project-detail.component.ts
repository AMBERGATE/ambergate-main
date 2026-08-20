import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectService, ProjectDetail } from '../../services/project.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit {
  public project?: ProjectDetail;
  public prevProject?: ProjectDetail;
  public nextProject?: ProjectDetail;

  // Visor interactivo Antes / Después dentro de la ficha
  public inspectSliderPosition: number = 50;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['id'];
      if (slug) {
        this.loadProject(slug);
      }
    });
  }

  private loadProject(slug: string): void {
    this.project = this.projectService.getProjectBySlug(slug);
    if (this.project) {
      const adjacent = this.projectService.getAdjacentProjects(slug);
      this.prevProject = adjacent.prev;
      this.nextProject = adjacent.next;
      this.inspectSliderPosition = 50;
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }, 10);
      }
    }
  }

  public onSliderInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.inspectSliderPosition = parseFloat(input.value);
  }
}
