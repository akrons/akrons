import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SermonsBackendComponent } from './sermons-backend.component';

describe('SermonsBackendComponent', () => {
  let component: SermonsBackendComponent;
  let fixture: ComponentFixture<SermonsBackendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SermonsBackendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SermonsBackendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
