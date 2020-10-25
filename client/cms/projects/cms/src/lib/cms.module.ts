import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElementComponent } from './components/element/element.component';
import { PageComponent } from './components/page/page.component';
import { ElementManagerService } from './services/element-manager.service';
import { HttpClientModule } from '@angular/common/http';
import { CMS_ENDPOINT_PROVIDER } from './injectors';


@NgModule({
  declarations: [
    ElementComponent,
    PageComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  exports: [
    PageComponent,
    ElementComponent,
  ],
})
export class CmsModule {
  static forRoot(
    options: {
      endpoint: string,
    }
  ): ModuleWithProviders<CmsModule> {
    return {
      ngModule: CmsModule,
      providers: [
        ElementManagerService,
        { provide: CMS_ENDPOINT_PROVIDER, useValue: options.endpoint },
      ]
    }
  }
}
