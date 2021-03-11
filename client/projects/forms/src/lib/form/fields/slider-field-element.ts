import { IEntityModel, Entity, EntityFactory } from '../entity';
import { IFormField } from '../form-element-model';
import { IFormElementDefinition } from '../form-element-definition';
import { FormDefinition } from '../form-definition';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SLIDER_TYPE } from './entity-types';
import { Functionality } from 'custom-exp';

export interface ISliderField extends IFormField {
    type: typeof SLIDER_TYPE;
    min?: IEntityModel<number>;
    max?: IEntityModel<number>;
    step?: IEntityModel<number>;
    default?: IEntityModel<number>;
    visible?: IEntityModel<boolean>;
}

export class SliderField implements IFormElementDefinition {

    public id: string;
    public type = SLIDER_TYPE;
    public min: number;
    public max: number;
    public step: number;
    public default: number;
    public visible: boolean;
    minEntity: Entity<number>;
    maxEntity: Entity<number>;
    stepEntity: Entity<number>;
    defaultEntity: Entity<number>;
    visibleEntity: Entity<boolean>;

    constructor(
        model: ISliderField,
        parentForm: FormDefinition,
        private index: number,
        private formGroup$: BehaviorSubject<FormGroup>,
    ) {
        this.id = String(model.id || index);
        this.minEntity = EntityFactory(model.min, parentForm, this, 0);
        this.maxEntity = EntityFactory(model.max, parentForm, this, 100);
        this.stepEntity = EntityFactory(model.step, parentForm, this, 1);
        this.defaultEntity = EntityFactory(model.default, parentForm, this, 0);
        this.visibleEntity = EntityFactory(model.visible, parentForm, this, true);
    }

    static addFunctionality(functionality: Functionality): void {
        const scopeType = SLIDER_TYPE + '-field';
        functionality.addFunctions({
            scopeType,
            name: 'default',
            eval: (scope: SliderField, parameters) => ({
                type: 'string',
                value: scope.value,
            }),
        });
        functionality.addFunctions({
            name: 'visible',
            scopeType,
            eval: (scope: SliderField, parameters) => ({
                type: 'boolean',
                value: scope.visible,
            }),
        });
        functionality.addFunctions({
            name: 'value',
            scopeType,
            eval: (scope: SliderField, parameters) => ({
                type: 'number',
                value: scope.value,
            }),
        });
        functionality.addFunctions({
            name: 'min',
            scopeType,
            eval: (scope: SliderField, parameters) => ({
                type: 'number',
                value: scope.min,
            }),
        });
        functionality.addFunctions({
            name: 'max',
            scopeType,
            eval: (scope: SliderField, parameters) => ({
                type: 'number',
                value: scope.max,
            }),
        });
        functionality.addFunctions({
            name: 'step',
            scopeType,
            eval: (scope: SliderField, parameters) => ({
                type: 'number',
                value: scope.step,
            }),
        });
        functionality.addFunctions({
            name: 'toString',
            scopeType,
            eval: (scope: SliderField, parameters) => ({
                type: 'string',
                value: String(scope.value),
            }),
        });
    }

    evalValues(): void {
        this.min = this.minEntity.value;
        this.max = this.maxEntity.value;
        this.step = this.stepEntity.value;
        this.default = this.defaultEntity.value;
        this.visible = this.visibleEntity.value;
    }

    getReactiveFormObject(value?: { [key: string]: any }): { [key: string]: any } {
        const result = {};
        if (value && value[this.id]) {
            result[this.id] = [value[this.id]];
        } else {
            result[this.id] = [this.default];
        }
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

