import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { MaterialModule } from '../../shared/material/material.module';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [FormsModule, MaterialModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
})
export class ContactFormComponent {
  constructor() {}

  onSubmit(contactForm?: NgForm) {
    const formValues = contactForm?.value;

    emailjs
      .send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formValues, 'YOUR_USER_ID')
      .then(
        (result: EmailJSResponseStatus) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  }
}
