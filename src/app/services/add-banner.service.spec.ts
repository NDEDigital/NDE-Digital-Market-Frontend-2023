import { TestBed } from '@angular/core/testing';

import { AddBannerService } from './add-banner.service';

describe('AddBannerService', () => {
  let service: AddBannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddBannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
