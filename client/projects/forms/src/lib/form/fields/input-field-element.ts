import { IFormElementDefinition } from '../form-element-definition';
import { Entity, EntityFactory, IEntityModel } from '../entity';
import { FormDefinition } from '../form-definition';
import { IFormField } from '../form-element-model';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { INPUT_TYPE } from './entity-types';
import { Functionality } from 'custom-exp';

export interface IInputField extends IFormField {
    type: typeof INPUT_TYPE;
    placeholder: IEntityModel<string>;
    default?: IEntityModel<string | number>;
    visible?: IEntityModel<boolean>;
    disabled?: IEntityModel<boolean>;
}

export class InputField implements IFormElementDefinition {

    public id: string;
    public type = INPUT_TYPE;
    public default: string | number;
    public placeHolder: string;
    public visible: boolean;
    public disabled: boolean;
    defaultEntity: Entity<string | number>;
    placeHolderEntity: Entity<string>;
    visibleEntity: Entity<boolean>;
    disabledEntity: Entity<boolean>;

    constructor(
        model: IInputField,
        parentForm: FormDefinition,
        private index: number,
        private formGroup$: BehaviorSubject<FormGroup>,
    ) {
        this.id = String(model.id || index);
        this.defaultEntity = EntityFactory(model.default, parentForm, this, '');
        this.placeHolderEntity = EntityFactory(model.placeholder, parentForm, this, '');
        this.visibleEntity = EntityFactory(model.visible, parentForm, this, true);
        this.disabledEntity = EntityFactory(model.disabled, parentForm, this, false);
    }


    static addFunctionality(functionality: Functionality): void {
        const scopeType = INPUT_TYPE + '-field';
        functionality.addFunctions({
            scopeType,
            name: 'default',
            eval: (scope: InputField, parameters) => ({
                type: 'string',
                value: scope.value,
            }),
        });
        functionality.addFunctions({
            name: 'visible',
            scopeType,
            eval: (scope: InputField, parameters) => ({
                type: 'boolean',
                value: scope.visible,
            }),
        });
        functionality.addFunctions({
            name: 'disabled',
            scopeType,
            eval: (scope: InputField, parameters) => ({
                type: 'boolean',
                value: scope.disabled,
            }),
        });
        functionality.addFunctions({
            name: 'value',
            scopeType,
            eval: (scope: InputField, parameters) => ({
                type: 'string',
                value: scope.value,
            }),
        });
        functionality.addFunctions({
            name: 'placeHolder',
            scopeType,
            eval: (scope: InputField, parameters) => ({
                type: 'string',
                value: scope.placeHolder,
            }),
        });
        functionality.addFunctions({
            name: 'toString',
            scopeType,
            eval: (scope: InputField, parameters) => ({
                type: 'string',
                value: String(scope.value),
            }),
        });
    }

    evalValues(): void {
        this.default = this.defaultEntity.value;
        this.placeHolder = this.placeHolderEntity.value;
        this.visible = this.visibleEntity.value;
        this.disabled = this.disabledEntity.value;
    }

    getReactiveFormObject(value?: { [key: string]: any }): { [key: string]: any } {
        const result = {};
        let setValue;
        if (value && value[this.id]) {
            setValue = value[this.id];
        } else {
            setValue = this.default;
        }
        result[this.id] = [{value: setValue, disabled: this.disabled}];
        return result;
    }


    get value(): string | number {
        const element = this.formGroup$.value.get(this.id);
        if (!element) {
            return this.default;
        }
        return element.value;
    }

}
