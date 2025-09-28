import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component/dashboard.component';
import { Campaigns } from './components/campaigns/campaigns';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'campaigns', component: Campaigns },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];