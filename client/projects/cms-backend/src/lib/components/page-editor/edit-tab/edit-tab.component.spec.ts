import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTabComponent } from './edit-tab.component';

describe('EditTabComponent', () => {
  let component: EditTabComponent;
  let fixture: ComponentFixture<EditTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
