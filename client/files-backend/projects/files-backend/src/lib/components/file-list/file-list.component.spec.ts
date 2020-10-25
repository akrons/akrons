import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendFileComponent } from './backend-file.component';

describe('BackendFileComponent', () => {
  let component: BackendFileComponent;
  let fixture: ComponentFixture<BackendFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackendFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackendFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
