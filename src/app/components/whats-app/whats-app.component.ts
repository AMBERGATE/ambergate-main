import { Component } from '@angular/core';
import { MaterialModule } from '../../shared/material/material.module';

@Component({
  selector: 'app-whats-app',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './whats-app.component.html',
  styleUrl: './whats-app.component.scss',
})
export class WhatsAppComponent {
  openWhatsApp() {
    const whatsappNumber = '+13058138672';
    const whatsappMessage = 'Hello, I am reaching out to you from my website.';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;
    window.open(whatsappUrl, '_blank');
  }
}
