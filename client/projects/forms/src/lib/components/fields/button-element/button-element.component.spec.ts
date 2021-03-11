import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonElementComponent } from './button-element.component';

describe('CheckboxElementComponent', () => {
    let component: ButtonElementComponent;
    let fixture: ComponentFixture<ButtonElementComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ButtonElementComponent ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ButtonElementComponent);
        component = fixture.componentInstance;
        component.XFormField = <any>{};
        component.XFormGroup = <any>{};
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
