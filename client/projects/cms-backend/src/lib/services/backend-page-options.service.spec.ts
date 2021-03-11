import { TestBed } from '@angular/core/testing';

import { BackendPageOptionsService } from './backend-page-options.service';

describe('BackendPageOptionsService', () => {
  let service: BackendPageOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendPageOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
