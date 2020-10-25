import { Type } from '@angular/core';
import { IElementComponent } from './element-component';

export interface IElementDefinition<T extends object> {
    type: string;
    componentFactory: Type<IElementComponent<T>>;
}
