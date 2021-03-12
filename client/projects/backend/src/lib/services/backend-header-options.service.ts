import { Injectable, Type } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackendHeaderOptionsService {

  private components: Type<any>[] = [];
  
  constructor() { }
  
  /**
   * Add a component which should be displayed in the header of the backend component.
   *
   * @param {Type<any>} component
   * @memberof BackendHeaderOptionsService
   */
  add(component: Type<any>): void {
    this.components.push(component);
  }
  
  getList(): Type<any>[] {
    return this.components;
  }
}
