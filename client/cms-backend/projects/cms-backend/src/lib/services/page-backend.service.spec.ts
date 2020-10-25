import { TestBed } from '@angular/core/testing';

import { PageBackendService } from './page-backend.service';

describe('PageBackendService', () => {
  let service: PageBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
