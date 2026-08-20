import { Routes } from '@angular/router';
import { Services3dComponent } from './components/services3d/services3d.component';
import { ProjectsCatalogComponent } from './components/projects-catalog/projects-catalog.component';

export const routes: Routes = [
  { path: '', component: Services3dComponent },
  { path: 'proyectos', component: ProjectsCatalogComponent },
  { path: 'projects', component: ProjectsCatalogComponent },
  { path: '**', redirectTo: '' }
];
