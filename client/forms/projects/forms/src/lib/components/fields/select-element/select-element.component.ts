import { Component, OnInit } from '@angular/core';
import { AbstractFormFieldComponent } from '../abstract-form-field/abstract-form-field.component';
import { SelectField } from '../../../form/fields/select-field-element';

@Component({
    selector: 'dynamic-reactive-forms-select-element',
    templateUrl: './select-element.component.html',
    styleUrls: ['./select-element.component.less'],
})
export class SelectElementComponent extends AbstractFormFieldComponent<SelectField> implements OnInit {

    constructor() {
        super();
    }

    ngOnInit(): void {
    }

}
