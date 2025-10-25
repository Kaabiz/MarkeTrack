import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component/dashboard.component';
import { Campaigns } from './components/campaigns/campaigns';
import { CampaignForm } from './components/campaign-form/campaign-form';
import { ClientsComponent } from './components/clients/clients';  // ADD THIS LINE

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'campaigns', component: Campaigns },
  { path: 'campaigns/new', component: CampaignForm },
  { path: 'campaigns/edit/:id', component: CampaignForm },
  { path: 'clients', component: ClientsComponent },           // ADD THIS LINE
  { path: '**', redirectTo: '/dashboard' }
];