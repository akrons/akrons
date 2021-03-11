import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractFormFieldComponent } from '../abstract-form-field/abstract-form-field.component';
import { ButtonField } from '../../../form/fields/button-field-element';

@Component({
    selector: 'dynamic-reactive-forms-button-element',
    templateUrl: './button-element.component.html',
    styleUrls: ['./button-element.component.less'],
})
export class ButtonElementComponent extends AbstractFormFieldComponent<ButtonField> implements OnInit {

    @Output()
    buttonClick: EventEmitter<string> = new EventEmitter();

    constructor() {
        super();
    }

    ngOnInit(): void {
    }

    handler(): void {
        this.buttonClick.emit(this.XFormField.function);
    }

}
