// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignService } from '../../services/campaign.service';
import { Campaign } from '../../models/campaign.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  campaigns: Campaign[] = [];
  loading = false;
  error?: string;

  constructor(private campaignService: CampaignService) {}

  ngOnInit() {
    this.loading = true;
    this.campaignService.getCampaigns().subscribe({
      next: (data) => {
        this.campaigns = data;
        this.loading = false;
        console.log('Campaigns:', this.campaigns);
      },
      error: (err) => {
        this.error = 'Failed to load campaigns.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
