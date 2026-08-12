import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceCardComponent, ServiceItemData } from '../service-card/service-card.component';

@Component({
  selector: 'app-services3d',
  standalone: true,
  imports: [CommonModule, ServiceCardComponent],
  templateUrl: './services3d.component.html',
  styleUrl: './services3d.component.scss'
})
export class Services3dComponent {
  public activeSectionIndex: number = 0;

  public servicesList: ServiceItemData[] = [
    {
      step: '01 / 04',
      badge: 'DEMOLITION & REMOVAL',
      title: 'Interior Selective Demolitions',
      description: 'Our expert selective interior demolition teams excel at preparing your space for its next big transformation. Removing parts of an existing structure demands exceptional craftsmanship and precision equipment.',
      stat1Value: '100%',
      stat1Label: 'Precision',
      stat2Value: 'Dust-Free',
      stat2Label: 'Containment',
      tags: ['Selective Strip-Out', 'MEP Preservation', 'Zero Structural Impact'],
      cubeColor: 0xDBA622
    },
    {
      step: '02 / 04',
      badge: 'FLOORING SPECIALISTS',
      title: 'Flooring Demolition & Removal',
      description: 'Ambergate USA is a leading professional flooring removal company. Our advanced floor removal equipment cuts floor covering and preparation time by 90% while ensuring effective dust containment.',
      stat1Value: '90%',
      stat1Label: 'Time Saved',
      stat2Value: 'HEPA',
      stat2Label: 'Filtered',
      tags: ['Tile & VCT Removal', 'Adhesive Grinding', 'Subfloor Repair'],
      cubeColor: 0xF59E0B
    },
    {
      step: '03 / 04',
      badge: 'SURFACE RESTORATION',
      title: 'High Pressure Cleaning',
      description: 'Premier provider of high-pressure cleaning services for residential and commercial properties. With state-of-the-art equipment and skilled technicians, we deliver unmatched cleanliness and surface restoration.',
      stat1Value: '4000+',
      stat1Label: 'PSI Power',
      stat2Value: 'Eco',
      stat2Label: 'Compliant',
      tags: ['Concrete Restoration', 'Oil Stain Removal', 'Exterior Prep'],
      cubeColor: 0x38BDF8
    },
    {
      step: '04 / 04',
      badge: 'SITE LOGISTICS',
      title: 'Junk Removal & Site Clean',
      description: 'Rapid debris haulage, construction waste removal, yard waste removal, furniture & appliance disposal, and foreclosure cleanouts. Full OSHA compliance and site cleanup.',
      stat1Value: '24/7',
      stat1Label: 'Fleet Dispatch',
      stat2Value: 'LEED',
      stat2Label: 'Certified',
      tags: ['Debris Hauling', 'Yard & Foreclosure', 'Recycling Paths'],
      cubeColor: 0xDBA622
    }
  ];

  public navigateNext(): void {
    const totalSections = this.servicesList.length + 1; // 4 services + hero (0) + footer (5)
    if (this.activeSectionIndex < totalSections) {
      this.activeSectionIndex++;
    } else {
      this.activeSectionIndex = 0; // Return to Top Hero
    }
    this.scrollToSection(this.activeSectionIndex);
  }

  public navigatePrev(): void {
    const totalSections = this.servicesList.length + 1;
    if (this.activeSectionIndex > 0) {
      this.activeSectionIndex--;
    } else {
      this.activeSectionIndex = totalSections; // Go to Footer
    }
    this.scrollToSection(this.activeSectionIndex);
  }

  public scrollToSection(index: number): void {
    this.activeSectionIndex = index;
    if (index > this.servicesList.length) {
      // Scroll to Footer
      const footerElement = document.querySelector('footer');
      if (footerElement) {
        footerElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
      return;
    }

    const targetElement = document.getElementById(`section-${index}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
