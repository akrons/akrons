import { Injectable } from '@angular/core';
import { IPageOption } from '../page-option';

@Injectable({
  providedIn: 'root'
})
export class BackendPageOptionsService {
  private elementMap: IPageOption<any>[] = [
    {
      key: 'id',
      description: 'Pfad',
      form: {
        type: 'input',
        id: 'id',
        placeholder: { type: 'static', value: 'Pfad' },
      }
    },
    {
      key: 'title',
      description: 'Titel',
      form: {
        type: 'input',
        id: 'title',
        placeholder: { type: 'static', value: 'Titel' },
      }
    }
  ];

  setElements(elements: IPageOption<any>[]): void {
    elements.forEach(e => this.elementMap.push(e));
  }

  addElement<T extends string>(element: IPageOption<T>): void {
    this.elementMap.push(element);
  }

  getElement(selector: string): IPageOption<any> {
    return this.elementMap.find(x => x.key === selector);
  }
  getElements(): IPageOption<any>[] {
    return this.elementMap;
  }
}
