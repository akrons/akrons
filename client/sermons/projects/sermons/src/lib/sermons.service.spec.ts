import { TestBed } from '@angular/core/testing';

import { SermonsService } from './sermons.service';

describe('SermonsService', () => {
  let service: SermonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SermonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
