import { Component, HostListener, Renderer2 } from '@angular/core';
import { MaterialModule } from '../../shared/material/material.module';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  // Variable para almacenar el valor del desplazamiento
  scrollPosition: number = 0;

  // Inyecta el servicio Renderer2 en el constructor
  constructor(private renderer: Renderer2) {}

  // Función que se ejecutará cuando ocurra el evento de scroll
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    // Accede al valor de scrollTop y actualiza la variable
    this.scrollPosition = window.scrollY;
  }

  // mat() {
  //   console.log('click');
  // }

  // redirectToInstagram() {
  //   const instagramUrl =
  //     'https://www.instagram.com/ambergateusa?igsh=djZyNm00aHR0N3hl';
  //   window.open(instagramUrl, '_blank');
  // }

  // openWhatsApp() {
  //   const whatsappNumber = '+13058138672';
  //   const whatsappMessage =
  //     'Hola, estoy en contacto contigo desde mi sitio web.';
  //   const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  //     whatsappMessage
  //   )}`;
  //   window.open(whatsappUrl, '_blank');
  // }

  // openFacebookProfile() {
  //   const facebookProfileUrl =
  //     'https://www.facebook.com/people/Ambergate-USA/61556601179632/';
  //   window.open(facebookProfileUrl, '_blank');
  // }

  // openEmail() {
  //   const emailAddress = 'info@ambergateusa.com';
  //   const emailSubject = 'Consulta desde mi sitio web';
  //   const emailBody = 'Hola,\n\nEstoy en contacto contigo desde mi sitio web.';
  //   const emailUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(
  //     emailSubject
  //   )}&body=${encodeURIComponent(emailBody)}`;
  //   window.location.href = emailUrl;
  // }

  // Función para llevar la posición de desplazamiento a cero
  scrollToTop(): void {
    // Utiliza Renderer2 para ajustar el scrollTop de la ventana a cero
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
    this.renderer.setProperty(document.body, 'scrollTop', 0);
  }
}
