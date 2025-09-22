import { TestBed } from '@angular/core/testing';

import { Campaign } from './campaign';

describe('Campaign', () => {
  let service: Campaign;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Campaign);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
