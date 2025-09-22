import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  campaigns: any[] = [];

  constructor(private campaignService: CampaignService) {}

  ngOnInit() {
    this.campaignService.getCampaigns().subscribe(data => {
      this.campaigns = data;
    });
  }
}
