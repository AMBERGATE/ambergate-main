import { CUSTOM_ELEMENTS_SCHEMA, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';

import { SwiperContainer, register } from 'swiper/element/bundle';
import { WhatsAppComponent } from './components/whats-app/whats-app.component';
import { HeaderComponent } from './components/header/header.component';

import { SwiperOptions } from 'swiper/types';
// register Swiper custom elements
register();

import { Services3dComponent } from './components/services3d/services3d.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, FooterComponent, WhatsAppComponent, HeaderComponent, Services3dComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  title = 'ambergate-fe';

  constructor() {}

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
