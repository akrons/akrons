import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrayElementComponent } from './array-element.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('ArrayElementComponent', () => {
    let component: ArrayElementComponent;
    let fixture: ComponentFixture<ArrayElementComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ArrayElementComponent ],
            imports: [
                ReactiveFormsModule,
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ArrayElementComponent);
        component = fixture.componentInstance;
        component.XFormField = <any>{};
        component.XFormGroup = <any>{};
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
