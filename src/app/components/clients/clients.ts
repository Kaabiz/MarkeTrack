import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client';
import { ClientFormDialogComponent } from '../client-form-dialog/client-form-dialog';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSelectModule
  ],
  templateUrl: './clients.html',
  styleUrl: './clients.scss'
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  displayedClients: Client[] = [];
  
  displayedColumns: string[] = ['name', 'email', 'age', 'gender', 'occupation', 'location', 'actions'];
  
  loading = false;
  searchQuery = '';
  
  // Pagination
  pageSize = 10;
  pageIndex = 0;
  totalClients = 0;
  pageSizeOptions = [5, 10, 20, 50];

  // Filter & Sort properties
  genderFilter = 'all';
  sortBy = '';
  Math = Math; // For template access

  // Statistics
  stats = {
    total: 0,
    male: 0,
    female: 0,
    avgAge: 0
  };

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.loading = true;
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.filteredClients = data;
        this.totalClients = data.length;
        this.calculateStats();
        this.updateDisplayedClients();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load clients', err);
        this.loading = false;
        this.snackBar.open('❌ Failed to load clients', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  calculateStats() {
    this.stats.total = this.clients.length;
    this.stats.male = this.clients.filter(c => c.gender?.toLowerCase() === 'male').length;
    this.stats.female = this.clients.filter(c => c.gender?.toLowerCase() === 'female').length;
    
    const ages = this.clients.filter(c => c.age).map(c => c.age!);
    this.stats.avgAge = ages.length > 0 
      ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) 
      : 0;
  }

  // Percentage calculations
  getMalePercentage(): number {
    return this.stats.total > 0 ? (this.stats.male / this.stats.total) * 100 : 0;
  }

  getFemalePercentage(): number {
    return this.stats.total > 0 ? (this.stats.female / this.stats.total) * 100 : 0;
  }

  applyFilter() {
    const query = this.searchQuery.toLowerCase().trim();
    
    this.filteredClients = this.clients.filter(client => {
      // Gender filter
      const genderMatch = this.genderFilter === 'all' || client.gender === this.genderFilter;
      
      // Search filter
      const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
      const searchMatch = !query || 
        fullName.includes(query) ||
        client.email?.toLowerCase().includes(query) ||
        client.occupation?.toLowerCase().includes(query) ||
        client.location?.toLowerCase().includes(query);
      
      return genderMatch && searchMatch;
    });
    
    this.totalClients = this.filteredClients.length;
    this.pageIndex = 0;
    this.applySorting();
  }

  applySorting() {
    if (!this.sortBy) {
      this.updateDisplayedClients();
      return;
    }

    this.filteredClients.sort((a, b) => {
      switch (this.sortBy) {
        case 'name': {
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          return nameA.localeCompare(nameB);
        }
        case 'name_desc': {
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          return nameB.localeCompare(nameA);
        }
        case 'age':
          return (a.age || 0) - (b.age || 0);
        case 'age_desc':
          return (b.age || 0) - (a.age || 0);
        default:
          return 0;
      }
    });

    this.pageIndex = 0;
    this.updateDisplayedClients();
  }

  updateDisplayedClients() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedClients = this.filteredClients.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateDisplayedClients();
  }

  // Filter methods
  resetGenderFilter() {
    this.genderFilter = 'all';
    this.applyFilter();
  }

  resetSort() {
    this.sortBy = '';
    this.applySorting();
  }

  resetAllFilters() {
    this.searchQuery = '';
    this.genderFilter = 'all';
    this.sortBy = '';
    this.applyFilter();
  }

  hasActiveFilters(): boolean {
    return this.searchQuery !== '' || this.genderFilter !== 'all' || this.sortBy !== '';
  }

  getSortLabel(): string {
    const labels: { [key: string]: string } = {
      'name': 'Name (A-Z)',
      'name_desc': 'Name (Z-A)',
      'age': 'Age (Low-High)',
      'age_desc': 'Age (High-Low)'
    };
    return labels[this.sortBy] || '';
  }

  openAddClientDialog() {
    const dialogRef = this.dialog.open(ClientFormDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog',
      data: { client: null }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientService.createClient(result).subscribe({
          next: (newClient) => {
            this.loadClients();
            this.snackBar.open('✅ Client added successfully!', '✓', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            console.error('Failed to create client', err);
            this.snackBar.open('❌ Failed to add client', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }
  
  openEditClientDialog(client: Client) {
    const dialogRef = this.dialog.open(ClientFormDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog',
      data: { client: { ...client } }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientService.updateClient(client.id!, result).subscribe({
          next: (updatedClient) => {
            this.loadClients();
            this.snackBar.open('✅ Client updated successfully!', '✓', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            console.error('Failed to update client', err);
            this.snackBar.open('❌ Failed to update client', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  deleteClient(client: Client) {
    const fullName = `${client.firstName} ${client.lastName}`;
    if (confirm(`Are you sure you want to delete ${fullName}?`)) {
      this.clientService.deleteClient(client.id!).subscribe({
        next: () => {
          this.loadClients();
          this.snackBar.open('🗑️ Client deleted successfully', '✓', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (err) => {
          console.error('Failed to delete client', err);
          this.snackBar.open('❌ Failed to delete client', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  viewClient(client: Client) {
    const fullName = `${client.firstName} ${client.lastName}`;
    this.snackBar.open(`👁️ Viewing: ${fullName}`, 'OK', {
      duration: 2000
    });
    console.log('View client:', client);
  }
}