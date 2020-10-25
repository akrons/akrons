import { TestBed } from '@angular/core/testing';

import { SermonsBackendService } from './sermons-backend.service';

describe('SermonsBackendService', () => {
  let service: SermonsBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SermonsBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
