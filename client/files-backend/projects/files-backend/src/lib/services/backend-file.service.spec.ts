import { TestBed } from '@angular/core/testing';

import { BackendFileService } from './backend-file.service';

describe('BackendFileService', () => {
  let service: BackendFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
