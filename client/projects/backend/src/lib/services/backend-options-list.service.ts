import { Injectable, Type } from '@angular/core';
import { PermissionProviderService } from '@akrons/core';
import { Route, Router } from '@angular/router';
import { BackendWelcomeComponent } from '../components/backend-welcome/backend-welcome.component';

@Injectable({
  providedIn: 'root'
})
export class BackendOptionsListService {

  private options: IBackenOptionsListOption[] = [];

  constructor(
    private permissionProviderService: PermissionProviderService,
  ) { 
    this.addOption({
      name: 'Home',
      path: '',
      permission: '',
      route: { path: '', component: BackendWelcomeComponent },
      icon: 'Home'
    })
  }

  /**
   * Adds an menu-option for the backend menu of the backend menu component.
   *
   * @param {IBackenOptionsListOption} option
   * @memberof BackendOptionsListService
   */
  addOption(option: IBackenOptionsListOption): void {
    this.options.push(option);
  }

  getOptions(): IBackenOptionsListOption[] {
    return this.options.filter(option => this.permissionProviderService.hasPermission(option.permission));
  }
}

export interface IBackenOptionsListOption {
  /**
   * Name of the Menu entry to display.
   *
   * @type {string}
   * @memberof IBackenOptionsListOption
   */
  name: string;
  /**
   * An material-icon name to display in the menu. 
   *
   * @type {string}
   * @memberof IBackenOptionsListOption
   */
  icon?: string;
  /**
   * The path the menu item should navigate to.
   * 
   * @type {string}
   * @memberof IBackenOptionsListOption
   */
  path: string;
  /**
   * If set, the path is external and will be opened in a new browser tab.
   *
   * @type {boolean}
   * @memberof IBackenOptionsListOption
   */
  external?: boolean;
  /**
   * Permission required to display this option.
   *
   * @type {string}
   * @memberof IBackenOptionsListOption
   */
  permission: string;
  /**
   * subRoute of the module.
   *
   * @type {Route}
   * @memberof IBackenOptionsListOption
   */
  route: Route;
}
