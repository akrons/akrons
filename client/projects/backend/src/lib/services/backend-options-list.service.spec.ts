import { TestBed } from '@angular/core/testing';

import { BackendOptionsListService } from './backend-options-list.service';

describe('BackendOptionsListService', () => {
  let service: BackendOptionsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendOptionsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
