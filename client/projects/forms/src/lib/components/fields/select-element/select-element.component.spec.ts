import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectElementComponent } from './select-element.component';
import { SelectField } from 'dist/dynamic-reactive-forms/lib/form/fields/select-field-element';

describe('SelectElementComponent', () => {
    let component: SelectElementComponent;
    let fixture: ComponentFixture<SelectElementComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ SelectElementComponent ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectElementComponent);
        component = fixture.componentInstance;
        component.XFormField = <any>{};
        component.XFormGroup = <any>{};
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
