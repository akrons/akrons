import { ModuleWithProviders, NgModule } from '@angular/core';
import { FileDeleteComponent } from './components/file-delete/file-delete.component';
import { FileEditComponent } from './components/file-edit/file-edit.component';
import { FileListComponent } from './components/file-list/file-list.component';
import { ImageSelectorComponent } from './components/image-selector/image-selector.component';
import { FILES_BACKEND_HOST_INJECTOR, FILES_HOST_INJECTOR } from './injectors';
import { BackendFileService } from './services/backend-file.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@akrons/core';


@NgModule({
  declarations: [
    FileDeleteComponent,
    FileEditComponent,
    FileListComponent,
    ImageSelectorComponent,
  ],
  imports: [
    CoreModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatRadioModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  exports: [
    FileListComponent,
    ImageSelectorComponent,
  ]
})
export class FilesBackendModule {
  public static forRoot(options: {
    backendEndpoint: string,
    endpoint: string,
  }): ModuleWithProviders<FilesBackendModule> {
    return {
      ngModule: FilesBackendModule,
      providers: [
        BackendFileService,
        { provide: FILES_HOST_INJECTOR, useValue: options.endpoint },
        { provide: FILES_BACKEND_HOST_INJECTOR, useValue: options.backendEndpoint },
      ]
    };
  }
}
