import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { joinPath, IUploadDialogData, UploadComponent } from '@akrons/core';
import { BackendFileService, IFile } from '../../services/backend-file.service';
import { FILES_BACKEND_HOST_INJECTOR, FILES_HOST_INJECTOR } from '../../injectors';

@Component({
  selector: 'app-backend-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.scss']
})
export class ImageSelectorComponent implements OnInit {

  selectedImage: IFile | undefined;

  files$: Observable<IFile[]>;

  constructor(
    @Inject(FILES_HOST_INJECTOR)
    private endpoint: string,
    @Inject(FILES_BACKEND_HOST_INJECTOR)
    private backendEndpoint: string,
    private fileService: BackendFileService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<any>,
  ) { }

  ngOnInit(): void {
    this.files$ = this.fileService.getAll$().pipe(
      map(files => files.filter(file => file.mimeType.startsWith('image/'))),
    );
  }

  getImageUrl(image: IFile): string {
    return joinPath(this.endpoint, image.name);
  }

  select(image: IFile): void {
    this.selectedImage = image;
  }

  save(): void {
    this.dialogRef.close(this.getImageUrl(this.selectedImage));
  }

  cancel(): void {
    this.dialogRef.close();
  }

  upload(): void {
    let dialogRef = this.dialog.open(UploadComponent, {
      height: '500px',
      width: '600px',
      closeOnNavigation: false,
      disableClose: false,
      data: <IUploadDialogData>{
        title: 'Bild hochladen',
        uploadEndpoint: this.backendEndpoint,
        filenamePrefix: 'images/',
        fileEndpoint: this.endpoint,
      }
    });
    dialogRef.afterClosed()
      .subscribe({
        next: async (result: string | undefined) => {
          if (result) {
            this.dialogRef.close(result);
          }
        },
      });
  }
}
