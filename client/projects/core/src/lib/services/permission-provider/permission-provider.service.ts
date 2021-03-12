import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionProviderService {

  permissionChecks: permissionCheckT[] = [];

  constructor() { }

  hasPermission(requiredPermission: string): boolean {
    for (let checker of this.permissionChecks) {
      if (!checker(requiredPermission)) {
        return false;
      }
    }
    return true;
  }

  addPermissionCheck(checker: permissionCheckT): void {
    this.permissionChecks.push(checker);
  }
}

export type permissionCheckT = (requiredPermission: string) => boolean;