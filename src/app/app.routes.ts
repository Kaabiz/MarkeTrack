import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component/dashboard.component';
import { Campaigns } from './components/campaigns/campaigns';
import { CampaignForm } from './components/campaign-form/campaign-form';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'campaigns', component: Campaigns },
  { path: 'campaigns/new', component: CampaignForm },        // NEW ROUTE
  { path: 'campaigns/edit/:id', component: CampaignForm },   // NEW ROUTE
  { path: '**', redirectTo: '/dashboard' }
];