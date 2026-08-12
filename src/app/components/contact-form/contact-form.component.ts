import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '../../shared/material/material.module';

@Component({
    selector: 'app-contact-form',
    imports: [FormsModule, MaterialModule],
    templateUrl: './contact-form.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent {
  constructor() {}
}
