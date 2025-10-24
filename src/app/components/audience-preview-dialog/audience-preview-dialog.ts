import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CampaignService } from '../../services/campaign.service';
import { Client, Page } from '../../models/client';

@Component({
  selector: 'app-audience-preview-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>people</mat-icon>
      Target Audience Preview
      <span class="count-badge">{{ data.totalCount }} matches</span>
    </h2>

    <mat-dialog-content>
      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading && clients.length > 0">
        <table mat-table [dataSource]="clients" class="audience-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let client">
              {{ client.firstName }} {{ client.lastName }}
            </td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let client">{{ client.email }}</td>
          </ng-container>

          <ng-container matColumnDef="gender">
            <th mat-header-cell *matHeaderCellDef>Gender</th>
            <td mat-cell *matCellDef="let client">{{ client.gender || 'N/A' }}</td>
          </ng-container>

          <ng-container matColumnDef="age">
            <th mat-header-cell *matHeaderCellDef>Age</th>
            <td mat-cell *matCellDef="let client">{{ client.age || 'N/A' }}</td>
          </ng-container>

          <ng-container matColumnDef="occupation">
            <th mat-header-cell *matHeaderCellDef>Occupation</th>
            <td mat-cell *matCellDef="let client">{{ client.occupation || 'N/A' }}</td>
          </ng-container>

          <ng-container matColumnDef="location">
            <th mat-header-cell *matHeaderCellDef>Location</th>
            <td mat-cell *matCellDef="let client">{{ client.location || 'N/A' }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator
          [length]="totalElements"
          [pageSize]="pageSize"
          [pageSizeOptions]="[5, 10, 20, 50]"
          (page)="onPageChange($event)"
          showFirstLastButtons>
        </mat-paginator>
      </div>

      <div *ngIf="!loading && clients.length === 0" class="empty-state">
        <mat-icon>search_off</mat-icon>
        <p>No matching clients found</p>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .count-badge {
      background: #4f46e5;
      color: white;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 14px;
      margin-left: 12px;
    }

    mat-dialog-content {
      min-height: 300px;
      max-height: 60vh;
      overflow: auto;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
    }

    .audience-table {
      width: 100%;
      margin-bottom: 16px;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #64748b;

      mat-icon {
        font-size: 48px;
        height: 48px;
        width: 48px;
        margin-bottom: 16px;
      }
    }

    th.mat-header-cell {
      font-weight: 600;
      color: #475569;
    }

    td.mat-cell {
      color: #334155;
    }
  `]
})
export class AudiencePreviewDialogComponent implements OnInit {
  clients: Client[] = [];
  displayedColumns = ['name', 'email', 'gender', 'age', 'occupation', 'location'];
  loading = false;
  
  pageSize = 10;
  pageIndex = 0;
  totalElements = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { campaignId: number; totalCount: number },
    private dialogRef: MatDialogRef<AudiencePreviewDialogComponent>,
    private campaignService: CampaignService
  ) {}

  ngOnInit() {
    this.loadAudience();
  }

  loadAudience() {
    this.loading = true;
    this.campaignService.audience(this.data.campaignId, this.pageIndex, this.pageSize).subscribe({
      next: (page: Page<Client>) => {
        this.clients = page.content;
        this.totalElements = page.totalElements;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load audience', err);
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAudience();
  }

  close() {
    this.dialogRef.close();
  }
}