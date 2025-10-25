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
    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 24px 32px;
      margin: -24px -24px 24px -24px;
      border-radius: 16px 16px 0 0;
      font-size: 24px;
      font-weight: 700;

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }
    }

    .count-badge {
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(10px);
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 700;
      margin-left: auto;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    mat-dialog-content {
      min-height: 300px;
      max-height: 60vh;
      overflow: auto;
      padding: 24px 32px;

      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(102, 126, 234, 0.05);
        border-radius: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 10px;
      }
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
    }

    .audience-table {
      width: 100%;
      margin-bottom: 16px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);

      th.mat-header-cell {
        background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
        font-weight: 700;
        color: #2d3748;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 16px;
      }

      td.mat-cell {
        color: #334155;
        padding: 16px;
        border-bottom: 1px solid #e2e8f0;
      }

      tr.mat-row {
        transition: all 0.3s ease;

        &:hover {
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
        }
      }
    }

    .empty-state {
      text-align: center;
      padding: 60px 40px;
      color: #64748b;

      mat-icon {
        font-size: 64px;
        height: 64px;
        width: 64px;
        margin-bottom: 20px;
        color: #cbd5e0;
      }

      p {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
      }
    }

    mat-dialog-actions {
      padding: 16px 32px;
      border-top: 2px solid rgba(102, 126, 234, 0.1);
      margin: 0 -24px -24px -24px;

      button {
        min-width: 120px;
        height: 44px;
        border-radius: 12px;
        font-weight: 700;
        transition: all 0.3s ease;

        &:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }
      }
    }

    ::ng-deep .mat-mdc-paginator {
      background: transparent !important;
      border-radius: 12px;
      padding: 8px 0;
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