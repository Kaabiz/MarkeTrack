import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent, MatPaginator } from '@angular/material/paginator';
import { Campaign } from '../../models/campaign.model';
import { CampaignService } from '../../services/campaign.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule
  ],
  templateUrl: './campaigns.html',
  styleUrls: ['./campaigns.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(80, [
            animate('0.6s cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ])
    ])
  ]
})
export class Campaigns implements OnInit, OnChanges {
  @Input() inputCampaigns?: Campaign[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  // Campaign data
  featuredCampaigns: any[] = [];
  filteredCampaigns: any[] = [];
  pagedCampaigns: any[] = [];
  loading = false;
  error?: string;
  
  // Search and filter
  searchText = '';
  currentStatusFilter = 'all';
  currentSortBy = 'budget_desc'; // Default sort by budget (highest first)
  
  // Pagination - changed to show 3 per row, so multiples of 3
  pageSize = 6;
  pageIndex = 0;
  startIndex = 0;
  endIndex = 0;
  
  constructor(private campaignService: CampaignService) {}
  
  ngOnInit() {
    this.loadCampaigns();
    console.log('Campaign component initialized');
  }
  
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
  
  // Search functionality with clear option
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
    let result = [...this.featuredCampaigns];
    
    console.log('Applying filters. Total campaigns:', result.length);
    
    // Apply search filter
    if (this.searchText) {
      result = result.filter(c => 
        c.name?.toLowerCase().includes(this.searchText.toLowerCase()) || 
        c.description?.toLowerCase().includes(this.searchText.toLowerCase())
      );
      console.log('After search filter:', result.length);
    }
    
    // Apply status filter
    if (this.currentStatusFilter !== 'all') {
      result = result.filter(c => 
        c.status?.toLowerCase() === this.currentStatusFilter.toLowerCase()
      );
      console.log('After status filter:', result.length);
    }
    
    // Apply sorting
    if (this.currentSortBy) {
      switch(this.currentSortBy) {
        case 'name':
          result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
          break;
        case 'name_desc':
          result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
          break;
        case 'budget':
          result.sort((a, b) => (a.budget || 0) - (b.budget || 0));
          break;
        case 'budget_desc':
          result.sort((a, b) => (b.budget || 0) - (a.budget || 0));
          break;
        default:
          break;
      }
    }
    
    this.filteredCampaigns = result;
    console.log('Filtered campaigns count:', this.filteredCampaigns.length);
    console.log('Page size:', this.pageSize);
    console.log('Should show pagination?', this.filteredCampaigns.length > this.pageSize);
    
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
    console.log(`Showing campaigns ${this.startIndex + 1}-${this.endIndex} of ${this.filteredCampaigns.length}`);
  }
  
  // Process campaigns for display
  private processCampaigns(campaigns: Campaign[]) {
    console.log('Processing campaigns, total count:', campaigns.length);
    
    // Transform backend model to component model - show ALL campaigns
    this.featuredCampaigns = campaigns.map(c => ({
      id: c.campaignId,
      name: c.campaignName,
      description: c.campaignObjective || 'No description available',
      status: c.campaignStatus,
      budget: c.campaignBudget,
      performance: this.getPerformance(c.campaignStatus),
      startDate: c.campaignStartDate,
      endDate: c.campaignEndDate
    }));
    
    // Apply default sorting and filtering
    this.applyFilters();
  }
  
  private getPerformance(status: string): string {
    switch(status?.toLowerCase()) {
      case 'active': return 'High';
      case 'paused': return 'Medium';
      case 'draft': return 'Not Started';
      case 'ended': return 'Completed';
      default: return 'Low';
    }
  }
}