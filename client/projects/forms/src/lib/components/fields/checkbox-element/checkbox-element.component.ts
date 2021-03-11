import { Component, OnInit } from '@angular/core';
import { AbstractFormFieldComponent } from '../abstract-form-field/abstract-form-field.component';
import { CheckboxField } from '../../../form/fields/checkbox-field-element';

@Component({
    selector: 'dynamic-reactive-forms-checkbox-element',
    templateUrl: './checkbox-element.component.html',
    styleUrls: ['./checkbox-element.component.less'],
})
export class CheckboxElementComponent extends AbstractFormFieldComponent<CheckboxField> implements OnInit {

    constructor() {
        super();
    }

    ngOnInit(): void {
    }

}
