import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignService } from '../../services/campaign.service';
import { Campaign } from '../../models/campaign.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Campaigns } from '../campaigns/campaigns';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatTableModule, 
    MatProgressSpinnerModule,
    MatIconModule,
    Campaigns
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(15px)' }),
          stagger(80, [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  campaigns: Campaign[] = [];
  displayedColumns: string[] = ['name', 'objective', 'status', 'budget', 'actions'];
  loading = false;
  error?: string;

  constructor(private campaignService: CampaignService) {}

  ngOnInit() {
    this.loadCampaigns();
  }

  loadCampaigns() {
    this.loading = true;
    this.campaignService.getCampaigns().subscribe({
      next: (data) => {
        this.campaigns = data;
        this.loading = false;
        console.log('Campaigns loaded:', this.campaigns.length);
      },
      error: (err) => {
        this.error = 'Failed to load campaigns.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  refreshData() {
    this.loading = true;
    this.error = undefined;
    
    this.campaignService.getCampaigns().subscribe({
      next: (data) => {
        this.campaigns = data;
        this.loading = false;
        console.log('Campaigns refreshed:', this.campaigns.length);
      },
      error: (err) => {
        this.error = 'Failed to refresh campaigns.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getTotalBudget(): number {
    return this.campaigns.reduce((sum, campaign) => sum + (campaign.campaignBudget || 0), 0);
  }
  
  // Fixed to be case-insensitive
  getActiveCount(): number {
    return this.campaigns.filter(c => 
      c.campaignStatus?.toLowerCase() === 'active'
    ).length;
  }
  
  // Add methods to get percentages for better visualization
  getActivePercentage(): number {
    return this.campaigns.length > 0 
      ? (this.getActiveCount() / this.campaigns.length) * 100 
      : 0;
  }
  
  getBudgetUtilization(): number {
    const totalBudget = this.getTotalBudget();
    const activeBudget = this.campaigns
      .filter(c => c.campaignStatus?.toLowerCase() === 'active')
      .reduce((sum, campaign) => sum + (campaign.campaignBudget || 0), 0);
    
    return totalBudget > 0 ? (activeBudget / totalBudget) * 100 : 0;
  }
}