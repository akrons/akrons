import { Injectable, Type } from '@angular/core';
import { IElementDefinition } from '../element-definition';

@Injectable()
export class ElementManagerService {
  private elementMap: Map<string, IElementDefinition<object>>;

  setElements(elements: IElementDefinition<object>[]): void {
    this.elementMap = new Map();
    elements.forEach(e => this.elementMap.set(e.type, e));
  }

  addElement<T extends object>(element: IElementDefinition<T>): void {
    this.elementMap.set(element.type, element);
  }

  getElement(selector: string): Type<any> {
    return this.elementMap.get(selector).componentFactory;
  }
}
