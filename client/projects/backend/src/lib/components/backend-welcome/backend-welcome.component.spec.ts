import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendWelcomeComponent } from './backend-welcome.component';

describe('BackendWelcomeComponent', () => {
  let component: BackendWelcomeComponent;
  let fixture: ComponentFixture<BackendWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackendWelcomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackendWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
