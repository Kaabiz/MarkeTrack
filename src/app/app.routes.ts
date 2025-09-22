import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component/dashboard.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
