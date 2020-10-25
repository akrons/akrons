import { Component, OnInit } from '@angular/core';
import { AbstractFormFieldComponent } from '../abstract-form-field/abstract-form-field.component';
import { SlideField } from '../../../form/fields/slide-field-element';

@Component({
    selector: 'dynamic-reactive-forms-slide-element',
    templateUrl: './slide-element.component.html',
    styleUrls: ['./slide-element.component.less'],
})
export class SlideElementComponent extends AbstractFormFieldComponent<SlideField> implements OnInit {

    constructor() {
        super();
    }

    ngOnInit(): void {
    }

}
