import { TestBed } from '@angular/core/testing';

import { TableHeadersService } from './table-headers.service';

describe('TableHeadersService', () => {
  let service: TableHeadersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableHeadersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
