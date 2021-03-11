import { Component, OnInit } from '@angular/core';
import { AbstractFormFieldComponent } from '../abstract-form-field/abstract-form-field.component';
import { FormArray, FormBuilder } from '@angular/forms';
import { ArrayField } from '../../../form/fields/array-field-element';

@Component({
    selector: 'dynamic-reactive-forms-array-element',
    templateUrl: './array-element.component.html',
    styleUrls: ['./array-element.component.css'],
})
export class ArrayElementComponent extends AbstractFormFieldComponent<ArrayField> implements OnInit {

    constructor(
        private fb: FormBuilder,
    ) {
        super();
    }

    ngOnInit(): void {
    }

    addElement(): void {
        this.XFormField.default.push('');
        this.ArrayFormElement.push(
            this.fb.control(''),
        );
    }

    removeElement(i: number): void {
        this.XFormField.default.splice(i, 1);
        this.ArrayFormElement.removeAt(i);
    }

    get ArrayFormElement(): FormArray {
        return this.XFormGroup.get(String(this.XFormField.id)) as FormArray;
    }

}
