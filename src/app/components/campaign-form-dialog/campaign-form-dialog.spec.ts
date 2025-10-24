import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignFormDialog } from './campaign-form-dialog';

describe('CampaignFormDialog', () => {
  let component: CampaignFormDialog;
  let fixture: ComponentFixture<CampaignFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignFormDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignFormDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
