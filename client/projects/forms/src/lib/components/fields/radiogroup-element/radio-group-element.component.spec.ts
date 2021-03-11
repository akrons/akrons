import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioGroupElementComponent } from './radio-group-element.component';

describe('RadiogroupElementComponent', () => {
    let component: RadioGroupElementComponent;
    let fixture: ComponentFixture<RadioGroupElementComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ RadioGroupElementComponent ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RadioGroupElementComponent);
        component = fixture.componentInstance;
        component.XFormField = <any>{};
        component.XFormGroup = <any>{};
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
