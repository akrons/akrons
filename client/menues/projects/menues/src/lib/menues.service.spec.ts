import { TestBed } from '@angular/core/testing';

import { MenuesService } from './menues.service';

describe('MenuesService', () => {
  let service: MenuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
