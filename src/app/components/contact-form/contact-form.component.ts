import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
}
