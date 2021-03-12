import { TestBed } from '@angular/core/testing';

import { PermissionProviderService } from './permission-provider.service';

describe('PermissionProviderService', () => {
  let service: PermissionProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
