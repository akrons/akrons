import { TestBed } from '@angular/core/testing';

import { BackendElementManagerService } from './backend-element-manager.service';

describe('BackendElementManagerService', () => {
  let service: BackendElementManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendElementManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
