import { IEntityModel, Entity, EntityFactory } from '../entity';
import { IFormField } from '../form-element-model';
import { IFormElementDefinition } from '../form-element-definition';
import { FormDefinition } from '../form-definition';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ARRAY_TYPE } from './entity-types';
import { Functionality } from 'custom-exp';

export interface IArrayField extends IFormField {
    type: typeof ARRAY_TYPE;
    default?: IEntityModel<string[]>;
    visible?: IEntityModel<boolean>;
}

export class ArrayField implements IFormElementDefinition {
    public id: string;
    public type = ARRAY_TYPE;

    public default: string[];
    public visible: boolean;
    defaultEntity: Entity<string[]>;
    visibleEntity: Entity<boolean>;



    constructor(
        model: IArrayField,
        parentForm: FormDefinition,
        private index: number,
        private formGroup$: BehaviorSubject<FormGroup>,
        private formBuilder: FormBuilder,
    ) {
        this.id = String(model.id || index);
        this.defaultEntity = EntityFactory(model.default, parentForm, this, []);
        this.visibleEntity = EntityFactory(model.visible, parentForm, this, true);
    }

    static addFunctionality(functionality: Functionality): void {
        const scopeType = ARRAY_TYPE + '-field';
        functionality.addFunctions({
            scopeType,
            name: 'default',
            eval: (scope: ArrayField, parameters) => ({
                type: 'string',
                value: scope.value,
            }),
        });
        functionality.addFunctions({
            name: 'visible',
            scopeType,
            eval: (scope: ArrayField, parameters) => ({
                type: 'boolean',
                value: scope.visible,
            }),
        });
        functionality.addFunctions({
            name: 'value',
            scopeType,
            eval: (scope: ArrayField, parameters) => ({
                type: 'array',
                value: scope.value,
            }),
        });
        functionality.addFunctions({
            name: 'toString',
            scopeType,
            eval: (scope: ArrayField, parameters) => ({
                type: 'string',
                value: String(scope.value),
            }),
        });
    }

    evalValues(): void {
        this.default = this.defaultEntity.value;
        this.visible = this.visibleEntity.value;
    }

    getReactiveFormObject(value?: { [key: string]: any }): { [key: string]: any } {
        const result = {};
        let setValue;
        if (value && value[this.id]) {
            setValue = this.formBuilder.array((value[this.id] as string[]).map(x => this.formBuilder.control(x)));
        } else {
            setValue = this.formBuilder.array(this.default.map(x => this.formBuilder.control(x)));
        }
        result[this.id] = setValue;
        return result;
    }

    get value(): string[] {
        const element = this.formGroup$.value.get(this.id);
        if (!element) {
            return this.default;
        }
        return element.value;
    }
}
