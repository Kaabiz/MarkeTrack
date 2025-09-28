import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Campaign } from '../../models/campaign.model';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatBadgeModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './campaigns.html',
  styleUrls: ['./campaigns.scss']
})
export class Campaigns implements OnInit {
  @Input() inputCampaigns?: Campaign[]; // Accept campaigns from parent
  
  featuredCampaigns: any[] = [];
  loading = false;
  error?: string;
  
  constructor(private campaignService: CampaignService) {}
  
  ngOnInit() {
    // If campaigns are passed in, use them
    if (this.inputCampaigns && this.inputCampaigns.length) {
      this.processCampaigns(this.inputCampaigns);
    } else {
      // Otherwise fetch from service
      this.loading = true;
      this.campaignService.getCampaigns().subscribe({
        next: (data) => {
          this.processCampaigns(data);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Could not load campaigns';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }
  
  private processCampaigns(campaigns: Campaign[]) {
    // Get top 3 campaigns by budget
    const sortedCampaigns = [...campaigns].sort((a, b) => 
      (b.campaignBudget || 0) - (a.campaignBudget || 0)
    ).slice(0, 3);
    
    // Transform backend model to component model
    this.featuredCampaigns = sortedCampaigns.map(c => ({
      name: c.campaignName,
      description: c.campaignObjective || 'No description available',
      status: c.campaignStatus,
      budget: c.campaignBudget,
      performance: this.getPerformance(c.campaignStatus)
    }));
  }
  
  private getPerformance(status: string): string {
    switch(status.toLowerCase()) {
      case 'active': return 'High';
      case 'paused': return 'Medium';
      default: return 'Low';
    }
  }
}