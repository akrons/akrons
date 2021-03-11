import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleService } from './services/title-service/title.service';
import { CORE_PRODUCTION_INJECTOR, CORE_TITLE_INJECTOR } from './injectors';
import { HttpService } from './services/http/http.service';
import { UploadComponent } from './dialogs/upload/upload.component';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { AddToDatePipe } from './pipes/add-date';
import { BytexPipe } from './pipes/bytex';
import { DatexPipe } from './pipes/datex';
import { EntryComponentComponent } from './components/entry-component/entry-component.component';
import { DialogHostComponent } from './components/dialog-host/dialog-host.component';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    UploadComponent,
    AddToDatePipe,
    BytexPipe,
    DatexPipe,
    EntryComponentComponent,
    DialogHostComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
  ],
  exports: [
    EntryComponentComponent,
    AddToDatePipe,
    BytexPipe,
    DatexPipe,
  ]
})
export class CoreModule {
  public static forRoot(options: {
    titlePrefix?: string,
    production: boolean,
  }): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        TitleService,
        HttpService,
        { provide: CORE_TITLE_INJECTOR, useValue: options.titlePrefix },
        { provide: CORE_PRODUCTION_INJECTOR, useValue: options.production }
      ]
    };
  }
  constructor(titleService: TitleService) {
    titleService.setTitle();
  }
}
