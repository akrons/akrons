import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxElementComponent } from './checkbox-element.component';

describe('CheckboxElementComponent', () => {
    let component: CheckboxElementComponent;
    let fixture: ComponentFixture<CheckboxElementComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CheckboxElementComponent ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CheckboxElementComponent);
        component = fixture.componentInstance;
        component.XFormField = <any>{};
        component.XFormGroup = <any>{};
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
