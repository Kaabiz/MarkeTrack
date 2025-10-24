import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CampaignService } from '../../services/campaign.service';
import { Campaign } from '../../models/campaign.model';
import { AudiencePreviewDialogComponent } from '../audience-preview-dialog/audience-preview-dialog';

@Component({
  selector: 'app-campaign-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatSnackBarModule
  ],
  templateUrl: './campaign-form-dialog.html',
  styleUrl: './campaign-form-dialog.scss'
})
export class CampaignFormDialogComponent implements OnInit {
  campaignForm!: FormGroup;
  loading = false;
  audienceCount = 0;
  loadingCount = false;

  statusOptions = ['ACTIVE', 'PAUSED', 'ENDED', 'DRAFT'];
  genderOptions = ['Male', 'Female', 'Other'];

  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private dialogRef: MatDialogRef<CampaignFormDialogComponent>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { campaign?: Campaign; mode: 'create' | 'edit' }
  ) {}

  ngOnInit() {
    this.initForm();
    
    if (this.data.mode === 'edit' && this.data.campaign) {
      this.campaignForm.patchValue(this.data.campaign);
    }

    this.campaignForm.valueChanges.subscribe(() => {
      if (this.hasTargetingCriteria() && this.data.campaign?.campaignId) {
        this.updateAudienceCount();
      }
    });
  }

  initForm() {
    this.campaignForm = this.fb.group({
      campaignName: ['', [Validators.required, Validators.minLength(3)]],
      campaignObjective: ['', Validators.required],
      campaignBudget: [0, [Validators.required, Validators.min(0)]],
      campaignStatus: ['DRAFT'],
      campaignStartDate: [null],
      campaignEndDate: [null],
      
      targetGender: [null],
      targetMinAge: [null, [Validators.min(0), Validators.max(120)]],
      targetMaxAge: [null, [Validators.min(0), Validators.max(120)]],
      targetOccupation: [null],
      targetLocation: [null],
      targetInterests: [null]
    });
  }

  hasTargetingCriteria(): boolean {
    const values = this.campaignForm.value;
    return !!(
      values.targetGender ||
      values.targetMinAge ||
      values.targetMaxAge ||
      values.targetOccupation ||
      values.targetLocation ||
      values.targetInterests
    );
  }

  updateAudienceCount() {
    const campaignId = this.data.campaign?.campaignId;
    if (!campaignId || !this.hasTargetingCriteria()) {
      this.audienceCount = 0;
      return;
    }

    this.loadingCount = true;
    this.campaignService.audienceCount(campaignId).subscribe({
      next: (count) => {
        this.audienceCount = count;
        this.loadingCount = false;
      },
      error: (err: any) => {
        console.error('Failed to get audience count', err);
        this.loadingCount = false;
      }
    });
  }

  previewAudience() {
    const campaignId = this.data.campaign?.campaignId;
    if (!campaignId) {
      this.snackBar.open('⚠️ Please save the campaign first before previewing audience', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['warning-snackbar']
      });
      return;
    }

    this.dialog.open(AudiencePreviewDialogComponent, {
      width: '900px',
      maxHeight: '80vh',
      data: {
        campaignId: campaignId,
        totalCount: this.audienceCount
      }
    });
  }

  clearTargeting() {
    this.campaignForm.patchValue({
      targetGender: null,
      targetMinAge: null,
      targetMaxAge: null,
      targetOccupation: null,
      targetLocation: null,
      targetInterests: null
    });
    this.audienceCount = 0;
  }

  onSubmit() {
    if (this.campaignForm.invalid) {
      this.campaignForm.markAllAsTouched();
      this.snackBar.open('⚠️ Please fill in all required fields correctly', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['warning-snackbar']
      });
      return;
    }

    this.loading = true;
    const campaignData: Campaign = this.campaignForm.value as Campaign;

    const request = this.data.mode === 'edit' && this.data.campaign?.campaignId
      ? this.campaignService.updateCampaign(this.data.campaign.campaignId, campaignData)
      : this.campaignService.createCampaign(campaignData);

    request.subscribe({
      next: (response) => {
        console.log('Campaign saved successfully', response);
        this.loading = false;
        
        // Show beautiful success message
        this.showSuccessMessage();
        
        // Close dialog after a short delay
        setTimeout(() => {
          this.dialogRef.close({ success: true, campaign: response });
        }, 1500);
      },
      error: (err: any) => {
        console.error('Failed to save campaign', err);
        this.loading = false;
        
        // Show error message
        this.snackBar.open('❌ Failed to save campaign. Please try again.', 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  showSuccessMessage() {
    const message = this.data.mode === 'edit' 
      ? '✅ Campaign updated successfully!' 
      : '🎉 Campaign created successfully!';
    
    this.snackBar.open(message, '🚀', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }
  

  cancel() {
    this.dialogRef.close();
  }

  get isEditMode(): boolean {
    return this.data.mode === 'edit';
  }

      // ...existing code...
  
    getFormProgress(): number {
      const formValues = this.campaignForm.value;
      const totalFields = 8; // campaignName, objective, budget, status, startDate, endDate, and 2 targeting fields
      let filledFields = 0;
  
      if (formValues.campaignName) filledFields++;
      if (formValues.campaignObjective) filledFields++;
      if (formValues.campaignBudget > 0) filledFields++;
      if (formValues.campaignStatus) filledFields++;
      if (formValues.campaignStartDate) filledFields++;
      if (formValues.campaignEndDate) filledFields++;
      if (this.hasTargetingCriteria()) filledFields += 2;
  
      return (filledFields / totalFields) * 100;
    }
  
    getGenderIcon(gender: string): string {
      switch (gender?.toLowerCase()) {
        case 'male': return 'male';
        case 'female': return 'female';
        case 'other': return 'transgender';
        default: return 'person';
      }
    }
  
    // ...existing code...
  }