import { FormDefinition } from './form-definition';
import { IFormElementDefinition } from './form-element-definition';
import { evaluateExpression, Functionality } from 'custom-exp';
import { InitFunctionality } from './initfunctionality';
export interface IStaticEntityModel<T> {
    type: 'static';
    value: T;
}
export interface IDynamicEntityModel {
    type: 'dynamic';
    unCompiledFunction: string;
}

export type IEntityModel<T> = IStaticEntityModel<T> | IDynamicEntityModel;
export interface Entity<T> {
    value: T;
}

export class StaticEntity<T> implements Entity<T> {
    constructor(public value: T) { }
}

export class DynamicEntity<T> implements Entity<T> {

    constructor(
        private form: FormDefinition,
        private element: IFormElementDefinition,
        private unCompiledFunction: string,
    ) {

    }
    get value(): T {
        try {
            const functionality = InitFunctionality(this.element, this.form);
            return evaluateExpression(functionality, this.unCompiledFunction);
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}



export function EntityFactory<T>(model: IEntityModel<T>, form: FormDefinition, element: IFormElementDefinition, defaultVal: T): Entity<T> {
    if (!model) {
        return new StaticEntity(defaultVal);
    }
    if (model.type === 'static') {
        return new StaticEntity(model.value);
    } else {
        return new DynamicEntity(form, element, model.unCompiledFunction);
    }
}
