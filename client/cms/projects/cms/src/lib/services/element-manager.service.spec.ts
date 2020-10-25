import { TestBed } from '@angular/core/testing';

import { ElementManagerService } from './element-manager.service';

describe('ElementManagerService', () => {
  let service: ElementManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElementManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
