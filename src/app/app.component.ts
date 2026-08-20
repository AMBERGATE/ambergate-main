import { CUSTOM_ELEMENTS_SCHEMA, Component, signal, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';

import { SwiperContainer, register } from 'swiper/element/bundle';

import { SwiperOptions } from 'swiper/types';
// register Swiper custom elements
register();

import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    imports: [FooterComponent, RouterOutlet, RouterLink],
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

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      if (url.includes('/proyectos') || url.includes('/proyecto/')) {
        this.isDarkSection.set(false);
      }
      
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }, 10);
      }
    });
  }

  ngOnInit(): void {
    // La detección de secciones ahora se maneja en onWindowScroll para mayor precisión en móviles
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollY = window.scrollY;
    this.isScrolled.set(scrollY > 80);
    this.showStickyCta.set(scrollY > 420);

    if (typeof window !== 'undefined') {
      const darkSectionIds = ['sec-3', 'sec-5'];
      let isDark = false;
      const checkY = window.innerHeight * 0.2; // Detectar justo debajo del header
      
      const sections = document.querySelectorAll('section[id], app-footer');
      for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].getBoundingClientRect();
        if (rect.top <= checkY && rect.bottom >= checkY) {
          if (darkSectionIds.includes(sections[i].id) || sections[i].tagName.toLowerCase() === 'app-footer') {
            isDark = true;
          }
          break;
        }
      }

      if (this.isDarkSection() !== isDark) {
        this.isDarkSection.set(isDark);
      }
    }
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
