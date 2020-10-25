import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderElementComponent } from './slider-element.component';

describe('SliderElementComponent', () => {
    let component: SliderElementComponent;
    let fixture: ComponentFixture<SliderElementComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ SliderElementComponent ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SliderElementComponent);
        component = fixture.componentInstance;
        component.XFormField = <any>{};
        component.XFormGroup = <any>{};
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
