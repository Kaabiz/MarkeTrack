import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
export class Campaigns implements OnInit, OnChanges {
  @Input() inputCampaigns?: Campaign[]; // Accept campaigns from parent
  
  featuredCampaigns: any[] = [];
  loading = false;
  error?: string;
  
  constructor(private campaignService: CampaignService) {}
  
  ngOnInit() {
    this.loadCampaigns();
  }
  
  // Add this method to detect when inputCampaigns changes
  ngOnChanges(changes: SimpleChanges) {
    if (changes['inputCampaigns']) {
      console.log('Input campaigns changed, count:', this.inputCampaigns?.length);
      this.loadCampaigns();
    }
  }
  
  loadCampaigns() {
    // If campaigns are passed in, use them
    if (this.inputCampaigns && this.inputCampaigns.length) {
      console.log('Processing input campaigns:', this.inputCampaigns.length);
      this.processCampaigns(this.inputCampaigns);
    } else {
      // Otherwise fetch from service
      this.loading = true;
      this.campaignService.getCampaigns().subscribe({
        next: (data) => {
          console.log('Campaigns component received data:', data.length);
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
  
  refreshCampaigns() {
    this.loading = true;
    this.error = undefined;
    this.inputCampaigns = undefined; // Clear cached campaigns
    
    this.campaignService.getCampaigns().subscribe({
      next: (data) => {
        console.log('Refreshed campaigns data:', data);
        this.processCampaigns(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Could not refresh campaigns';
        this.loading = false;
        console.error(err);
      }
    });
  }
  
  // Update the processCampaigns method
  
  private processCampaigns(campaigns: Campaign[]) {
    console.log('Processing campaigns, total count:', campaigns.length);
    
    // Get top 3 campaigns by budget
    const sortedCampaigns = [...campaigns].sort((a, b) => 
      (b.campaignBudget || 0) - (a.campaignBudget || 0)
    ).slice(0, 3);
    
    // Transform backend model to component model
    this.featuredCampaigns = sortedCampaigns.map(c => ({
      id: c.campaignId,
      name: c.campaignName,
      description: c.campaignObjective || 'No description available',
      status: c.campaignStatus,
      budget: c.campaignBudget,
      performance: this.getPerformance(c.campaignStatus)
    }));
    
    console.log('Featured campaigns:', this.featuredCampaigns);
  }
  
  private getPerformance(status: string): string {
    switch(status.toLowerCase()) {
      case 'active': return 'High';
      case 'paused': return 'Medium';
      default: return 'Low';
    }
  }
}