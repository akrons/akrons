import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalLineElementComponent } from './horizontal-line-element.component';

describe('HorizontalLineElementComponent', () => {
  let component: HorizontalLineElementComponent;
  let fixture: ComponentFixture<HorizontalLineElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorizontalLineElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalLineElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
