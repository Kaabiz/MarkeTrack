import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudiencePreviewDialog } from './audience-preview-dialog';

describe('AudiencePreviewDialog', () => {
  let component: AudiencePreviewDialog;
  let fixture: ComponentFixture<AudiencePreviewDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudiencePreviewDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudiencePreviewDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
