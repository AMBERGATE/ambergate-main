import { CUSTOM_ELEMENTS_SCHEMA, Component, signal, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';

import { SwiperContainer, register } from 'swiper/element/bundle';

import { SwiperOptions } from 'swiper/types';
// register Swiper custom elements
register();

import { RouterOutlet, RouterLink } from '@angular/router';
import { Services3dComponent } from './components/services3d/services3d.component';

@Component({
    selector: 'app-root',
    imports: [FooterComponent, Services3dComponent, RouterOutlet, RouterLink],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  title = 'ambergate-fe';
  isScrolled = signal(false);
  showStickyCta = signal(false);
  isDarkSection = signal(false);

  constructor() {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.initSectionObserver();
    }
  }

  private initSectionObserver(): void {
    const darkSectionIds = ['sec-3', 'sec-5'];
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const isDark = darkSectionIds.includes(entry.target.id) || entry.target.tagName.toLowerCase() === 'app-footer';
          this.isDarkSection.set(isDark);
        }
      });
    }, {
      rootMargin: '-50px 0px -80% 0px',
      threshold: 0
    });

    setTimeout(() => {
      const sections = document.querySelectorAll('section[id], app-footer');
      sections.forEach(sec => observer.observe(sec));
    }, 500);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollY = window.scrollY;
    this.isScrolled.set(scrollY > 80);
    this.showStickyCta.set(scrollY > 420);
  }

  scrollToContact(): void {
    const contactSection = document.getElementById('contact-form') || document.getElementById('contact') || document.querySelector('app-footer');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  }

  interior_selective_demolitions = [
    {
      url: './assets/img/1-interior-selective-demolitions/01.webp',
    },
    {
      url: './assets/img/1-interior-selective-demolitions/03.webp',
    },
    {
      url: './assets/img/1-interior-selective-demolitions/04.webp',
    },
  ];

  HIGH_PRESSURE_CLEANING = [
    {
      url: './assets/img/3-high-pressure/01.webp',
    },
    {
      url: './assets/img/3-high-pressure/02.webp',
    },
    {
      url: './assets/img/3-high-pressure/03.webp',
    },
  ];

  FLOORING_DEMOLITION_REMOVAL = [
    {
      url: './assets/img/2-flooring-demolition-removal/01.webp',
    },
    {
      url: './assets/img/2-flooring-demolition-removal/02.webp',
    },
  ];

  JUNK_REMOVAL = [
    {
      url: './assets/img/4-junk-removal/01.webp',
    },
    {
      url: './assets/img/4-junk-removal/02.webp',
    },
    {
      url: './assets/img/4-junk-removal/03.webp',
    },
    {
      url: './assets/img/4-junk-removal/04.webp',
    },
  ];
}
