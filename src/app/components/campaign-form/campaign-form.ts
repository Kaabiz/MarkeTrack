import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CampaignService } from '../../services/campaign.service';
import { Campaign } from '../../models/campaign.model'; // Use campaign.model.ts, not campaign.ts
import { Router, ActivatedRoute } from '@angular/router';
import { AudiencePreviewDialogComponent } from '../audience-preview-dialog/audience-preview-dialog';

@Component({
  selector: 'app-campaign-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './campaign-form.html',
  styleUrl: './campaign-form.scss'
})
export class CampaignForm implements OnInit {
  campaignForm!: FormGroup;
  isEditMode = false;
  campaignId?: number;
  loading = false;
  audienceCount = 0;
  loadingCount = false;

  channelOptions = ['Email', 'Social', 'Search', 'Influencer', 'SMS'];
  statusOptions = ['ACTIVE', 'PAUSED', 'ENDED', 'DRAFT'];
  genderOptions = ['Male', 'Female', 'Other'];

  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.initForm();
    
    // Check if editing existing campaign
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.campaignId = +params['id'];
        this.loadCampaign(this.campaignId);
      }
    });

    // Auto-update audience count when targeting fields change
    this.campaignForm.valueChanges.subscribe(() => {
      if (this.hasTargetingCriteria()) {
        this.updateAudienceCount();
      }
    });
  }

  initForm() {
    this.campaignForm = this.fb.group({
      // Use the correct property names from campaign.model.ts
      campaignName: ['', [Validators.required, Validators.minLength(3)]],
      campaignChannel: ['Email'],
      campaignBudget: [0, [Validators.required, Validators.min(0)]],
      campaignStatus: ['DRAFT'],
      campaignObjective: [''],
      campaignStartDate: [null],
      campaignEndDate: [null],
      
      // Targeting fields
      targetGender: [null],
      targetMinAge: [null, [Validators.min(0), Validators.max(120)]],
      targetMaxAge: [null, [Validators.min(0), Validators.max(120)]],
      targetOccupation: [null],
      targetLocation: [null],
      targetInterests: [null]
    });
  }

   // ...existing code...
  loadCampaign(id: number) {
    this.loading = true;
    this.campaignService.getCampaign(id).subscribe({
      next: (campaign: Campaign) => {
        this.campaignForm.patchValue(campaign);
        this.loading = false;
        this.updateAudienceCount();
      },
      error: (err: any) => {
        console.error('Failed to load campaign', err);
        this.loading = false;
      }
    });
  }
  // ...existing code...

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
    if (!this.campaignId || !this.hasTargetingCriteria()) {
      this.audienceCount = 0;
      return;
    }

    this.loadingCount = true;
    this.campaignService.audienceCount(this.campaignId).subscribe({
      next: (count) => {
        this.audienceCount = count;
        this.loadingCount = false;
      },
      error: (err) => {
        console.error('Failed to get audience count', err);
        this.loadingCount = false;
      }
    });
  }

  previewAudience() {
    if (!this.campaignId) {
      alert('Please save the campaign first before previewing audience');
      return;
    }

    this.dialog.open(AudiencePreviewDialogComponent, {
      width: '900px',
      maxHeight: '80vh',
      data: {
        campaignId: this.campaignId,
        totalCount: this.audienceCount
      }
    });
  }

  onSubmit() {
    if (this.campaignForm.invalid) {
      this.campaignForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const campaignData: Campaign = this.campaignForm.value as Campaign;

    const request = this.isEditMode && this.campaignId
      ? this.campaignService.updateCampaign(this.campaignId, campaignData)
      : this.campaignService.createCampaign(campaignData);

    request.subscribe({
      next: (response) => {
        console.log('Campaign saved successfully', response);
        this.loading = false;
        this.router.navigate(['/campaigns']);
      },
      error: (err) => {
        console.error('Failed to save campaign', err);
        this.loading = false;
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

  cancel() {
    this.router.navigate(['/campaigns']);
  }
}