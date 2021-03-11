import { ModuleWithProviders, NgModule } from '@angular/core';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { GroupEditComponent } from './components/group-edit/group-edit.component';
import { GroupListComponent } from './components/group-list/group-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CoreModule } from '@akrons/core';
import { CommonModule } from '@angular/common';
import { AUTH_BACKEND_ENDPOINT_INJECTOR } from './injectors';
import { UserResetPasswordComponent } from './components/user-reset-password/user-reset-password.component';
import { UserPasswordFeedbackComponent } from './components/user-password-feedback/user-password-feedback.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BackendPageOptionsService } from '@akrons/cms-backend';
import { BackendOptionsListService, BackendHeaderOptionsService } from '@akrons/backend';

@NgModule({
  declarations: [
    UserListComponent,
    UserEditComponent,
    GroupEditComponent,
    GroupListComponent,
    UserResetPasswordComponent,
    UserPasswordFeedbackComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    CoreModule
  ],
  exports: [
    UserListComponent,
    GroupListComponent
  ]
})
export class AuthBackendModule {

  constructor(
    backendPageOptionsService: BackendPageOptionsService,
    backendOptionsListService: BackendOptionsListService,
    backendHeaderOptionsService: BackendHeaderOptionsService
  ) {
    backendPageOptionsService.setElements([
      {
        key: 'requiredViewPermission',
        description: 'Benötigte Anzeige-Berechtigungen',
        form: {
          type: 'input',
          id: 'requiredViewPermission',
          placeholder: { type: 'static', value: 'Benötigte Anzeige-Berechtigungen' },
        },
      }
    ]);
    backendOptionsListService.addOption({
      name: 'Benutzer Verwalten',
      permission: 'api.auth.users',
      icon: 'person',
      path: 'users',
      route: { path: 'users', component: UserListComponent }
    });
    backendOptionsListService.addOption({
      name: 'Gruppen Verwalten',
      permission: 'api.auth.groups',
      icon: 'groups',
      path: 'groups',
      route: { path: 'groups', component: GroupListComponent }
    });
  }

  static forRoot(
    options: {
      endpoint: string,
    }
  ): ModuleWithProviders<AuthBackendModule> {
    return {
      ngModule: AuthBackendModule,
      providers: [
        { provide: AUTH_BACKEND_ENDPOINT_INJECTOR, useValue: options.endpoint },
      ]
    }
  }
}
