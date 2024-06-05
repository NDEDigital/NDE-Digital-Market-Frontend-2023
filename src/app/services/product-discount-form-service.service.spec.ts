import { TestBed } from '@angular/core/testing';

import { ProductDiscountFormServiceService } from './product-discount-form-service.service';

describe('ProductDiscountFormServiceService', () => {
  let service: ProductDiscountFormServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductDiscountFormServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
