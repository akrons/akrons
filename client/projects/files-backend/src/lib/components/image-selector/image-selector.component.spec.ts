import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendImageSelectorComponent } from './backend-image-selector.component';

describe('BackendImageSelectorComponent', () => {
  let component: BackendImageSelectorComponent;
  let fixture: ComponentFixture<BackendImageSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackendImageSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackendImageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
