import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsComponent } from './clients'; // Changed from 'Clients' to 'ClientsComponent'

describe('ClientsComponent', () => { // Updated describe block name
  let component: ClientsComponent; // Changed type
  let fixture: ComponentFixture<ClientsComponent>; // Changed type

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsComponent] // Changed from 'Clients' to 'ClientsComponent'
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsComponent); // Changed reference
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});