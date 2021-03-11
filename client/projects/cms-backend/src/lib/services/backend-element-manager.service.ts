import { Injectable, Type } from '@angular/core';
import { IElementDefinition } from '../element-definition';

@Injectable({
  providedIn: 'root'
})
export class BackendElementManagerService {
  private elementMap: IElementDefinition<object>[] = [];

  setElements(elements: IElementDefinition<object>[]): void {
    elements.forEach(e => this.elementMap.push(e));
  }

  addElement<T extends object>(element: IElementDefinition<T>): void {
    this.elementMap.push(element);
  }

  getElement(selector: string): IElementDefinition<object> {
    return this.elementMap.find(x => x.type === selector);
  }
  getElements(): IElementDefinition<object>[] {
    return this.elementMap;
  }
}
