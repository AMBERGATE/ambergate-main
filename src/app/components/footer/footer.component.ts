import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MaterialModule } from '../../shared/material/material.module';

@Component({
    selector: 'app-footer',
    imports: [MaterialModule],
    templateUrl: './footer.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrl: './footer.component.scss'
})
export class FooterComponent {
  get currentYear(): number {
    return new Date().getFullYear();
  }

  redirectToInstagram() {
    const instagramUrl =
      'https://www.instagram.com/ambergateusa?igsh=djZyNm00aHR0N3hl';
    window.open(instagramUrl, '_blank');
  }

  openFacebookProfile() {
    const facebookProfileUrl =
      'https://www.facebook.com/people/Ambergate-USA/61556601179632/';
    window.open(facebookProfileUrl, '_blank');
  }

  openEmail() {
    const emailAddress = 'info@ambergateusa.com';
    const emailSubject = 'Consulta desde mi sitio web';
    const emailBody = 'Hola,\n\nEstoy en contacto contigo desde mi sitio web.';
    const emailUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = emailUrl;
  }
}
