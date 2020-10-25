import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryComponentComponent } from './entry-component.component';

describe('EntryComponentComponent', () => {
  let component: EntryComponentComponent;
  let fixture: ComponentFixture<EntryComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
