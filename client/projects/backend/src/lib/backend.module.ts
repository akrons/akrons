import { ModuleWithProviders, NgModule } from '@angular/core';
import { BACKEND_TITLE_INJECTOR } from './injectors';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BackendComponent } from './components/backend/backend.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'projects/core/dist/public-api';
import { BackendWelcomeComponent } from './components/backend-welcome/backend-welcome.component';

@NgModule({
  declarations: [
    BackendComponent,
    BackendWelcomeComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: []
})
export class BackendModule {
  static forRoot(
    options: {
      backendTitle: string,
    }
  ): ModuleWithProviders<BackendModule> {
    return {
      ngModule: BackendModule,
      providers: [
        { provide: BACKEND_TITLE_INJECTOR, useValue: options.backendTitle },
      ],
    };
  }
}
