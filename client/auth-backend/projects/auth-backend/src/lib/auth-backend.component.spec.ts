import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthBackendComponent } from './auth-backend.component';

describe('AuthBackendComponent', () => {
  let component: AuthBackendComponent;
  let fixture: ComponentFixture<AuthBackendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthBackendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthBackendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
