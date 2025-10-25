import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Client } from '../../models/client';

@Component({
  selector: 'app-client-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './client-form-dialog.html',
  styleUrl: './client-form-dialog.scss'
})
export class ClientFormDialogComponent implements OnInit {
  clientForm!: FormGroup;
  isEditMode = false;
  loading = false;

  genderOptions = ['Male', 'Female', 'Other'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ClientFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { client?: Client }
  ) {}

  ngOnInit() {
    this.isEditMode = !!this.data?.client;
    this.initForm();
  }

  initForm() {
    const client = this.data?.client;

    this.clientForm = this.fb.group({
      firstName: [client?.firstName || '', [Validators.required, Validators.minLength(2)]],
      lastName: [client?.lastName || '', [Validators.required, Validators.minLength(2)]],
      email: [client?.email || '', [Validators.required, Validators.email]],
      age: [client?.age || null, [Validators.min(1), Validators.max(120)]],
      gender: [client?.gender || ''],
      occupation: [client?.occupation || ''],
      location: [client?.location || ''],
      interests: [client?.interests || ''],
      marketingOptIn: [client?.marketingOptIn || false]
    });
  }

  onSubmit() {
    if (this.clientForm.valid) {
      const formValue = this.clientForm.value;
      
      // Prepare client data
      const clientData: Client = {
        ...formValue,
        id: this.data?.client?.id // Include ID if editing
      };

      this.dialogRef.close(clientData);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.clientForm.controls).forEach(key => {
        this.clientForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  // Helper methods for validation
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.clientForm.get(fieldName);
    return !!(field?.hasError(errorType) && field?.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.clientForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Minimum ${minLength} characters required`;
    }
    if (field?.hasError('min')) {
      return 'Age must be at least 1';
    }
    if (field?.hasError('max')) {
      return 'Age must be less than 120';
    }
    
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      age: 'Age',
      gender: 'Gender',
      occupation: 'Occupation',
      location: 'Location',
      interests: 'Interests'
    };
    return labels[fieldName] || fieldName;
  }
}