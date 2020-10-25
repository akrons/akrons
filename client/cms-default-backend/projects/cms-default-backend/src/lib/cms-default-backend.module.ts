import { NgModule } from '@angular/core';
import { BackendElementManagerService, CmsBackendModule } from '@akrons/cms-backend';
import { HorizontalLineElement } from './horizontal-line-element';
import { ImageElement } from './image-element';
import { TextElement } from './text-element';
import { TitleElement } from './title-element';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [],
  imports: [
    MatDialogModule,
    CmsBackendModule,
  ],
  exports: [],
  providers: [
  ]
})
export class CmsDefaultBackendModule {
  constructor(
    backendElementManagerService: BackendElementManagerService,
  ) {
    backendElementManagerService.setElements([
      TitleElement,
      TextElement,
      ImageElement,
      HorizontalLineElement,
    ]);
  }
}
