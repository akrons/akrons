import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormComponent } from './form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EMPTY, Subject } from 'rxjs';

describe('FormComponent', () => {
    let component: FormComponent;
    let fixture: ComponentFixture<FormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ FormComponent ],
            imports: [
                ReactiveFormsModule,
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FormComponent);
        component = fixture.componentInstance;
        component.formModel = <any>EMPTY;
        component.hideSubmitButton = false; 
        component.submitButtonText = 'submit';
        component.abortButton = true;
        component.abortButtonText = 'abort';
        component.result$ = new Subject();
        component.changes$ = new Subject();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
