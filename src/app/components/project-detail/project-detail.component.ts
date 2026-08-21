import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectService, ProjectDetail } from '../../services/project.service';

import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit {
  @ViewChild('sliderContainer') sliderContainer?: ElementRef<HTMLDivElement>;

  public project?: ProjectDetail;
  public prevProject?: ProjectDetail;
  public nextProject?: ProjectDetail;

  // Visor interactivo Antes / Después dentro de la ficha
  public inspectSliderPosition: number = 50;
  private isSliding: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private seoService: SeoService
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
      const description = this.project.caseStudyDescription || this.project.details;
      this.seoService.updateSeo({
        title: `${this.project.title} | Selective Demolition Miami`,
        description: `${description.slice(0, 140)}... Proyecto de demolición ejecutado por Ambergate USA en ${this.project.location}.`,
        keywords: `${this.project.title}, Demolición ${this.project.location}, Demolición Comercial Miami, Ambergate USA, ${this.project.category}`,
        ogImage: this.project.thumbnail || this.project.afterImg,
        ogType: 'article'
      });

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

  public startSliderDrag(event: MouseEvent | TouchEvent): void {
    this.isSliding = true;
    this.updateSliderPosition(event);
  }

  public onSliderMove(event: MouseEvent | TouchEvent): void {
    if (!this.isSliding) return;
    this.updateSliderPosition(event);
  }

  public stopSliderDrag(): void {
    this.isSliding = false;
  }

  private updateSliderPosition(event: MouseEvent | TouchEvent): void {
    if (!this.sliderContainer) return;
    const rect = this.sliderContainer.nativeElement.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const offsetX = clientX - rect.left;
    let percentage = (offsetX / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    this.inspectSliderPosition = percentage;
  }
}
