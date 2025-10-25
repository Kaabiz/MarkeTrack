import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CampaignService } from './campaign.service';
import { ClientService } from './client.service';
import { Campaign } from '../models/campaign.model';
import { Client, Page } from '../models/client';

export interface AnalyticsData {
  kpis: {
    totalBudget: number;
    totalClients: number;
    averageAge: number;
    activeCampaigns: number;
    totalCampaigns: number;
    budgetUtilization: number;
  };
  campaignBudgets: {
    labels: string[];
    data: number[];
  };
  clientGender: {
    labels: string[];
    data: number[];
  };
  campaignStatus: {
    labels: string[];
    data: number[];
  };
  clientLocations: {
    labels: string[];
    data: number[];
  };
  topCampaigns: Campaign[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(
    private campaignService: CampaignService,
    private clientService: ClientService
  ) {}

  getAnalyticsData(): Observable<AnalyticsData> {
    return combineLatest({
      campaigns: this.campaignService.getCampaigns().pipe(
        catchError(err => {
          console.error('Failed to load campaigns for analytics:', err);
          return of([]);
        })
      ),
      clients: this.clientService.getAllClients().pipe(
        catchError(err => {
          console.error('Failed to load clients for analytics:', err);
          return of([]);
        })
      )
    }).pipe(
      map(({ campaigns, clients }) => this.calculateAnalytics(campaigns, clients))
    );
  }

  private calculateAnalytics(campaigns: Campaign[], clients: Client[]): AnalyticsData {
    // KPIs
    const totalBudget = campaigns.reduce((sum, c) => sum + (c.campaignBudget || 0), 0);
    const totalClients = clients.length;
    const ages = clients.filter(c => c.age).map(c => c.age!);
    const averageAge = ages.length > 0 ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0;
    const activeCampaigns = campaigns.filter(c => 
      c.campaignStatus?.toLowerCase() === 'active'
    ).length;
    const totalCampaigns = campaigns.length;
    const budgetUtilization = totalCampaigns > 0 ? (activeCampaigns / totalCampaigns) * 100 : 0;

    // Campaign Budgets (Top 5)
    const topBudgetCampaigns = [...campaigns]
      .sort((a, b) => (b.campaignBudget || 0) - (a.campaignBudget || 0))
      .slice(0, 5);

    const campaignBudgets = {
      labels: topBudgetCampaigns.map(c => c.campaignName || 'Unnamed Campaign'),
      data: topBudgetCampaigns.map(c => c.campaignBudget || 0)
    };

    // Client Gender Distribution
    const genderCounts = clients.reduce((acc, client) => {
      const gender = client.gender || 'Other';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const clientGender = {
      labels: Object.keys(genderCounts),
      data: Object.values(genderCounts)
    };

    // Campaign Status Distribution
    const statusCounts = campaigns.reduce((acc, campaign) => {
      const status = campaign.campaignStatus || 'draft';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const campaignStatus = {
      labels: Object.keys(statusCounts).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
      data: Object.values(statusCounts)
    };

    // Client Locations (Top 5)
    const locationCounts = clients.reduce((acc, client) => {
      const location = client.location || 'Unknown';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topLocations = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const clientLocations = {
      labels: topLocations.map(l => l[0]),
      data: topLocations.map(l => l[1])
    };

    // Top Performing Campaigns (by budget)
    const topCampaigns = [...campaigns]
      .sort((a, b) => (b.campaignBudget || 0) - (a.campaignBudget || 0))
      .slice(0, 5);

    return {
      kpis: {
        totalBudget,
        totalClients,
        averageAge,
        activeCampaigns,
        totalCampaigns,
        budgetUtilization
      },
      campaignBudgets,
      clientGender,
      campaignStatus,
      clientLocations,
      topCampaigns
    };
  }
}