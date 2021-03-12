import { TestBed } from '@angular/core/testing';

import { BackendHeaderOptionsService } from './backend-header-options.service';

describe('BackendHeaderOptionsService', () => {
  let service: BackendHeaderOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendHeaderOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
