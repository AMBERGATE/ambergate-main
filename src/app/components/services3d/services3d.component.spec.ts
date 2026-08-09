import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Services3dComponent } from './services3d.component';

describe('Services3dComponent', () => {
  let component: Services3dComponent;
  let fixture: ComponentFixture<Services3dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Services3dComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Services3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
