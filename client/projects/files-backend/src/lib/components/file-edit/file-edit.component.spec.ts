import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendFileEditComponent } from './backend-file-edit.component';

describe('BackendFileEditComponent', () => {
  let component: BackendFileEditComponent;
  let fixture: ComponentFixture<BackendFileEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackendFileEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackendFileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
