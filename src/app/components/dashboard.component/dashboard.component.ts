import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignService } from '../../services/campaign.service';
import { Campaign } from '../../models/campaign.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent, MatPaginator } from '@angular/material/paginator';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule, 
    MatButtonModule, 
    MatTableModule, 
    MatProgressSpinnerModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule
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
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.6s cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  campaigns: Campaign[] = [];
  filteredCampaigns: Campaign[] = [];
  pagedCampaigns: Campaign[] = [];
  displayedColumns: string[] = ['name', 'objective', 'status', 'budget', 'actions'];
  loading = false;
  error?: string;
  
  // Search and filter
  searchText = '';
  currentStatusFilter = 'all';
  currentSortBy = '';
  
  // Pagination
  pageSize = 10;
  pageIndex = 0;
  startIndex = 0;
  endIndex = 0;

  constructor(private campaignService: CampaignService) {}

  ngOnInit() {
    this.loadCampaigns();
  }

  loadCampaigns() {
    this.loading = true;
    this.campaignService.getCampaigns().subscribe({
      next: (data) => {
        this.campaigns = data;
        this.filteredCampaigns = [...data];
        this.updatePagedData();
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
        this.applyFilters();
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
  
  // Enhanced search functionality with clear option
  applyFilter() {
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.applyFilters();
  }
  
  clearSearch() {
    this.searchText = '';
    this.applyFilter();
  }
  
  applyStatusFilter() {
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.applyFilters();
  }
  
  resetStatusFilter() {
    this.currentStatusFilter = 'all';
    this.applyStatusFilter();
  }
  
  sortData() {
    this.applyFilters();
  }
  
  resetSort() {
    this.currentSortBy = '';
    this.sortData();
  }
  
  resetAllFilters() {
    this.searchText = '';
    this.currentStatusFilter = 'all';
    this.currentSortBy = '';
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.applyFilters();
  }
  
  hasActiveFilters(): boolean {
    return this.searchText !== '' || 
           this.currentStatusFilter !== 'all' || 
           this.currentSortBy !== '';
  }
  
  getSortLabel(): string {
    switch(this.currentSortBy) {
      case 'name': return 'Name (A-Z)';
      case 'name_desc': return 'Name (Z-A)';
      case 'budget': return 'Budget (Low-High)';
      case 'budget_desc': return 'Budget (High-Low)';
      default: return '';
    }
  }
  
  applyFilters() {
    // Start with all campaigns
    let result = [...this.campaigns];
    
    // Apply search filter
    if (this.searchText) {
      result = result.filter(c => 
        c.campaignName?.toLowerCase().includes(this.searchText.toLowerCase()) || 
        c.campaignObjective?.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
    
    // Apply status filter
    if (this.currentStatusFilter !== 'all') {
      result = result.filter(c => 
        c.campaignStatus?.toLowerCase() === this.currentStatusFilter.toLowerCase()
      );
    }
    
    // Apply sorting
    if (this.currentSortBy) {
      switch(this.currentSortBy) {
        case 'name':
          result.sort((a, b) => (a.campaignName || '').localeCompare(b.campaignName || ''));
          break;
        case 'name_desc':
          result.sort((a, b) => (b.campaignName || '').localeCompare(a.campaignName || ''));
          break;
        case 'budget':
          result.sort((a, b) => (a.campaignBudget || 0) - (b.campaignBudget || 0));
          break;
        case 'budget_desc':
          result.sort((a, b) => (b.campaignBudget || 0) - (a.campaignBudget || 0));
          break;
        default:
          break;
      }
    }
    
    this.filteredCampaigns = result;
    this.updatePagedData();
  }
  
  // Pagination
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePagedData();
  }
  
  updatePagedData() {
    this.startIndex = this.pageIndex * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize, this.filteredCampaigns.length);
    this.pagedCampaigns = this.filteredCampaigns.slice(this.startIndex, this.endIndex);
  }

  getTotalBudget(): number {
    return this.campaigns.reduce((sum, campaign) => sum + (campaign.campaignBudget || 0), 0);
  }
  
  // Get active campaigns count
  getActiveCount(): number {
    return this.campaigns.filter(c => 
      c.campaignStatus?.toLowerCase() === 'active'
    ).length;
  }
  
  // Get paused campaigns count
  getPausedCount(): number {
    return this.campaigns.filter(c => 
      c.campaignStatus?.toLowerCase() === 'paused'
    ).length;
  }
  
  // Get ended campaigns count
  getEndedCount(): number {
    return this.campaigns.filter(c => 
      c.campaignStatus?.toLowerCase() === 'ended'
    ).length;
  }
  
  // Get draft campaigns count
  getDraftCount(): number {
    return this.campaigns.filter(c => 
      c.campaignStatus?.toLowerCase() === 'draft'
    ).length;
  }
  
  // Calculate percentages
  getActivePercentage(): number {
    return this.campaigns.length > 0 
      ? (this.getActiveCount() / this.campaigns.length) * 100 
      : 0;
  }
  
  getPausedPercentage(): number {
    return this.campaigns.length > 0 
      ? (this.getPausedCount() / this.campaigns.length) * 100 
      : 0;
  }
  
  getBudgetUtilization(): number {
    const totalBudget = this.getTotalBudget();
    const activeBudget = this.campaigns
      .filter(c => c.campaignStatus?.toLowerCase() === 'active')
      .reduce((sum, campaign) => sum + (campaign.campaignBudget || 0), 0);
    
    return totalBudget > 0 ? (activeBudget / totalBudget) * 100 : 0;
  }
  
  getPausedBudget(): number {
    return this.campaigns
      .filter(c => c.campaignStatus?.toLowerCase() === 'paused')
      .reduce((sum, campaign) => sum + (campaign.campaignBudget || 0), 0);
  }
}