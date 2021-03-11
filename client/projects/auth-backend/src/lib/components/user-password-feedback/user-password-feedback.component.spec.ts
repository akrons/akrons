import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPasswordFeedbackComponent } from './user-password-feedback.component';

describe('UserPasswordFeedbackComponent', () => {
  let component: UserPasswordFeedbackComponent;
  let fixture: ComponentFixture<UserPasswordFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPasswordFeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPasswordFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
