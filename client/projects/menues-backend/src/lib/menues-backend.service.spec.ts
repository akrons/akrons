import { TestBed } from '@angular/core/testing';

import { MenuesBackendService } from './menues-backend.service';

describe('MenuesBackendService', () => {
  let service: MenuesBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuesBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
