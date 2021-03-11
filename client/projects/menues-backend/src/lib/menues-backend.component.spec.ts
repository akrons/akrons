import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuesBackendComponent } from './menues-backend.component';

describe('MenuesBackendComponent', () => {
  let component: MenuesBackendComponent;
  let fixture: ComponentFixture<MenuesBackendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuesBackendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuesBackendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
