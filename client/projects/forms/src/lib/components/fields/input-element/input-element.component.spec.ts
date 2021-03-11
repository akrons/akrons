import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputElementComponent } from './input-element.component';

describe('InputElementComponent', () => {
    let component: InputElementComponent;
    let fixture: ComponentFixture<InputElementComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ InputElementComponent ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InputElementComponent);
        component = fixture.componentInstance;
        component.XFormField = <any>{};
        component.XFormGroup = <any>{};
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
