import { ModuleWithProviders, NgModule } from '@angular/core';
import { EditTabComponent } from './components/page-editor/edit-tab/edit-tab.component';
import { OverviewTabComponent } from './components/page-editor/overview-tab/overview-tab.component';
import { PageEditorComponent } from './components/page-editor/page-editor.component';
import { CMS_BACKEND_ENDPOINT } from './injectors';
import { AddElementComponent } from './components/page-editor/edit-tab/add-element/add-element.component';
import { PageComponentEditComponent } from './components/page-editor/edit-tab/pageComponentEdit/pageComponentEdit.component';
import { AkronsFormsModule } from '@akrons/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { PageListComponent } from './components/page-list/page-list.component';
import { MatTableModule } from '@angular/material/table';
import { CmsModule } from '@akrons/cms';

@NgModule({
  declarations: [
    PageEditorComponent,
    EditTabComponent,
    OverviewTabComponent,
    AddElementComponent,
    PageComponentEditComponent,
    PageListComponent,
  ],
  imports: [
    CommonModule,
    AkronsFormsModule,
    CmsModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
  ],
  exports: [
    PageListComponent,
  ]
})
export class CmsBackendModule {
  static forRoot(options: {
    endpoint: string,
  }): ModuleWithProviders<CmsBackendModule> {
    return {
      ngModule: CmsBackendModule,
      providers: [
        { provide: CMS_BACKEND_ENDPOINT, useValue: options.endpoint }
      ]
    };
  }
}
