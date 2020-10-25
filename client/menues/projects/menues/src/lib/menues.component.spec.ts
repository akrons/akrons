import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuesComponent } from './menues.component';

describe('MenuesComponent', () => {
  let component: MenuesComponent;
  let fixture: ComponentFixture<MenuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
