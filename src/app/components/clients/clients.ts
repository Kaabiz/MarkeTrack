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
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client';

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
    MatTooltipModule
  ],
  templateUrl: './clients.html',
  styleUrl: './clients.scss'
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  displayedClients: Client[] = [];
  
  // ✅ FIXED: Use correct property names from Client model
  displayedColumns: string[] = ['id', 'name', 'email', 'age', 'gender', 'occupation', 'location', 'actions'];
  
  loading = false;
  searchQuery = '';
  
  // Pagination
  pageSize = 10;
  pageIndex = 0;
  totalClients = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];

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
    // ✅ FIXED: Use 'gender' instead of 'clientGender'
    this.stats.male = this.clients.filter(c => c.gender?.toLowerCase() === 'male').length;
    this.stats.female = this.clients.filter(c => c.gender?.toLowerCase() === 'female').length;
    
    // ✅ FIXED: Use 'age' instead of 'clientAge'
    const ages = this.clients.filter(c => c.age).map(c => c.age!);
    this.stats.avgAge = ages.length > 0 
      ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) 
      : 0;
  }

  applyFilter() {
    const query = this.searchQuery.toLowerCase().trim();
    
    if (!query) {
      this.filteredClients = this.clients;
    } else {
      // ✅ FIXED: Use correct property names
      this.filteredClients = this.clients.filter(client => {
        const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
        return fullName.includes(query) ||
               client.email?.toLowerCase().includes(query) ||
               client.occupation?.toLowerCase().includes(query) ||
               client.location?.toLowerCase().includes(query);
      });
    }
    
    this.totalClients = this.filteredClients.length;
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

  sortData(sort: Sort) {
    const data = this.filteredClients.slice();
    
    if (!sort.active || sort.direction === '') {
      this.filteredClients = data;
      this.updateDisplayedClients();
      return;
    }

    this.filteredClients = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        // ✅ FIXED: Use correct property names
        case 'id': return this.compare(a.id, b.id, isAsc);
        case 'name': 
          const nameA = `${a.firstName} ${a.lastName}`;
          const nameB = `${b.firstName} ${b.lastName}`;
          return this.compare(nameA, nameB, isAsc);
        case 'email': return this.compare(a.email, b.email, isAsc);
        case 'age': return this.compare(a.age, b.age, isAsc);
        case 'gender': return this.compare(a.gender, b.gender, isAsc);
        case 'occupation': return this.compare(a.occupation, b.occupation, isAsc);
        case 'location': return this.compare(a.location, b.location, isAsc);
        default: return 0;
      }
    });
    
    this.updateDisplayedClients();
  }

  compare(a: any, b: any, isAsc: boolean): number {
    if (a == null) return isAsc ? 1 : -1;
    if (b == null) return isAsc ? -1 : 1;
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  openAddClientDialog() {
    this.snackBar.open('⚠️ Client Form Dialog - Coming in next step!', 'OK', {
      duration: 3000,
      panelClass: ['warning-snackbar']
    });
    // TODO: Will implement in next step
  }

  openEditClientDialog(client: Client) {
    this.snackBar.open('⚠️ Client Form Dialog - Coming in next step!', 'OK', {
      duration: 3000,
      panelClass: ['warning-snackbar']
    });
    // TODO: Will implement in next step
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

  getGenderIcon(gender?: string): string {
    switch (gender?.toLowerCase()) {
      case 'male': return 'male';
      case 'female': return 'female';
      default: return 'person';
    }
  }

  getGenderColor(gender?: string): string {
    switch (gender?.toLowerCase()) {
      case 'male': return 'primary';
      case 'female': return 'accent';
      default: return 'warn';
    }
  }

  // ✅ ADDED: Helper method to get full name
  getFullName(client: Client): string {
    return `${client.firstName} ${client.lastName}`;
  }
}