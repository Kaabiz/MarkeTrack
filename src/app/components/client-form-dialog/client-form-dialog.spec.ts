import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFormDialog } from './client-form-dialog';

describe('ClientFormDialog', () => {
  let component: ClientFormDialog;
  let fixture: ComponentFixture<ClientFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientFormDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientFormDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
