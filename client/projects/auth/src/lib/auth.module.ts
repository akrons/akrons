import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AUTH_CHANGE_PASSWORD_REDIRECT_PROVIDER, AUTH_CHANGE_PASSWORD_ROUTE_PROVIDER, AUTH_ENDPOINT_PROVIDER, AUTH_LOGIN_REDIRECT_PROVIDER, AUTH_LOGIN_ROUTE_PROVIDER } from './injectors';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule, PermissionProviderService } from '@akrons/core';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    LoginComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  exports: [
    LoginComponent,
    ChangePasswordComponent
  ]
})
export class AuthModule {
  constructor(
    authService: AuthService,
    permissionProviderService: PermissionProviderService
  ) { 
    authService.init();
    permissionProviderService.addPermissionCheck(permission => authService.hasPermission(permission));
  }
  static forRoot(
    options: {
      endpoint: string,
      loginRedirect: string[],
      loginRoute: string[],
      changePasswordRedirect: string[],
      changePasswordRoute: string[],
    }
  ): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        { provide: AUTH_ENDPOINT_PROVIDER, useValue: options.endpoint },
        { provide: AUTH_LOGIN_REDIRECT_PROVIDER, useValue: options.loginRedirect },
        { provide: AUTH_LOGIN_ROUTE_PROVIDER, useValue: options.loginRoute },
        { provide: AUTH_CHANGE_PASSWORD_ROUTE_PROVIDER, useValue: options.changePasswordRoute },
        { provide: AUTH_CHANGE_PASSWORD_REDIRECT_PROVIDER, useValue: options.changePasswordRedirect },
      ]
    }
  }
}
