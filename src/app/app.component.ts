import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';

import { SwiperContainer, register } from 'swiper/element/bundle';
import { WhatsAppComponent } from './components/whats-app/whats-app.component';
import { HeaderComponent } from './components/header/header.component';
import { SwiperOptions } from 'swiper/types';
// register Swiper custom elements
register();

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, WhatsAppComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements OnInit, AfterViewInit {
  swiperElement = signal<SwiperContainer | null>(null);

  title = 'ambergate-fe';

  constructor() {}

  ngOnInit(): void {
    // const swiperElemContructor = document.querySelector('swiper-container');
    // // Define Swiper options including custom styles
    // const swiperOptions: SwiperOptions = {
    //   injectStyles: [
    //     `
    //     :host(.custom-theme) .swiper-wrapper {
    //       background-color: #f0f0f0; /* Cambia esto por el color que desees */
    //     }
    //     :host(.custom-theme) .swiper-slide {
    //       color: #333; /* Color del texto dentro de los slides */
    //     }
    //     `,
    //   ],
    // };
    // Object.assign(swiperElemContructor!, swiperOptions);
    // this.swiperElement.set(swiperElemContructor as SwiperContainer);
    // this.swiperElement()?.initialize();
  }

  ngAfterViewInit(): void {
    //  if (typeof document !== 'undefined') {  }
    // const swiperElemContructor = document.querySelector('swiper-container');
    // // Define Swiper options including custom styles
    // const swiperOptions: SwiperOptions = {
    //   // injectStyles: [
    //   //   `
    //   //     :host(.custom-theme) .swiper-wrapper {
    //   //       background-color: #000; /* Cambia esto por el color que desees */
    //   //     }
    //   //     :host(.custom-theme) .swiper-slide {
    //   //       color: #000; /* Color del texto dentro de los slides */
    //   //     }
    //   //     `,
    //   // ],
    // };
    // Object.assign(swiperElemContructor!, swiperOptions);
    // this.swiperElement.set(swiperElemContructor as SwiperContainer);
    // this.swiperElement()?.initialize();
  }

  interior_selective_demolitions = [
    {
      url: './../assets/img/1-interior-selective-demolitions/01.jpg',
    },
    {
      url: './../assets/img/1-interior-selective-demolitions/03.jpg',
    },
    {
      url: './../assets/img/1-interior-selective-demolitions/04.jpg',
    },
  ];

  HIGH_PRESSURE_CLEANING = [
    {
      url: './../assets/img/3-high-pressure/2cf5605eca0eaca8e88c4ba2d3e952ca.jpg',
    },
    {
      url: './../assets/img/3-high-pressure/4fffcb7fa1bad22d0af8de3b7b0988c0.jpg',
    },
    {
      url: './../assets/img/3-high-pressure/ac72220f64d5eb29240c5e433d9dd1e1.jpg',
    },
  ];

  FLOORING_DEMOLITION_REMOVAL = [
    {
      url: './../assets/img/2-flooring-demolition-removal/01.jpg',
    },
    {
      url: './../assets/img/2-flooring-demolition-removal/02.jpg',
    },
  ];
}
