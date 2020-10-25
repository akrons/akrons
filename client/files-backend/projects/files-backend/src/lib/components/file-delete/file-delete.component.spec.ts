import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendFileDeleteComponent } from './backend-file-delete.component';

describe('BackendFileDeleteComponent', () => {
  let component: BackendFileDeleteComponent;
  let fixture: ComponentFixture<BackendFileDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackendFileDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackendFileDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
