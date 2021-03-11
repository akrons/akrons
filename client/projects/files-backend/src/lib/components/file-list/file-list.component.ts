import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatDialog } from '@angular/material/dialog';
import { UploadComponent, IUploadDialogData, joinPath } from '@akrons/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FileEditComponent } from '../file-edit/file-edit.component';
import { FileDeleteComponent } from '../file-delete/file-delete.component';
import { BackendFileService } from '../../services/backend-file.service';
import { FILES_BACKEND_HOST_INJECTOR, FILES_HOST_INJECTOR } from '../../injectors';
import { file } from '@akrons/types';

@Component({
  selector: 'akrons-files-backend-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {

  treeControl = new NestedTreeControl<IFileDirectory>(node => node.children);
  data$: Observable<{ $implicit: IFileDirectory }>;
  usage$: Observable<{ result: number, limit?: number }>;

  constructor(
    @Inject(FILES_HOST_INJECTOR)
    private endpoint: string,
    @Inject(FILES_BACKEND_HOST_INJECTOR)
    private backendEndpoint: string,
    private fileService: BackendFileService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.usage$ = this.fileService.getSpaceUsage$();
    this.data$ = this.fileService.getAll$().pipe(
      map(files => {
        let directory: IFileDirectory = {
          name: 'api/file',
          children: [],
          open: true,
          icon: 'folder_open'
        };
        files.forEach(file => this.insertFileInDirectory(file.name.split('/').reverse(), file, directory));
        return { $implicit: directory };
      }),
    );
  }

  upload(): void {
    let dialogRef = this.dialog.open(UploadComponent, {
      height: '500px',
      width: '600px',
      closeOnNavigation: false,
      disableClose: false,
      data: <IUploadDialogData>{
        title: 'Datei hochladen',
        uploadEndpoint: this.backendEndpoint
      }
    });
    dialogRef.afterClosed()
      .subscribe({
        next: async (result: string | undefined) => {
          await this.fileService.refreshSubscriber();
        },
      });
  }

  insertFileInDirectory(path: string[], file: file.IFile, directory: IFileDirectory): void {
    if (path.length === 0) {
      directory.file = file;
      directory.icon = this.getIconByMimeType(file.mimeType);
      return;
    }
    let dirName = path.pop();
    let dir = directory.children.find(x => x.name === dirName);
    if (!dir) {
      dir = {
        name: dirName,
        children: [],
        icon: 'folder'
      };
      directory.children.push(dir);
    }
    this.insertFileInDirectory(path, file, dir);
  }

  editFile(file: file.IFile): void {
    let dialogRef = this.dialog.open(FileEditComponent, {
      data: file.id,
      height: '500px',
      width: '600px',
    });
  }

  deleteFile(file: file.IFile): void {
    let dialogRef = this.dialog.open(FileDeleteComponent, {
      height: '500px',
      width: '600px',
      data: file,
    });
  }

  getIconByMimeType(mime: string): string {
    if (this.isPicture(mime))
      return 'image';
    if (mime.startsWith('text/'))
      return 'code';
    if (mime.startsWith('video/'))
      return 'movie';
    if (mime.startsWith('audio/'))
      return 'audiotrack';
    if (mime === 'application/zip')
      return 'archive';
    if (mime === 'application/xml')
      return 'code';
    if (mime === 'application/pdf')
      return 'picture_as_pdf';
    if (mime === 'application/json')
      return 'code';
    if (mime === 'application/javascript')
      return 'code';
    if (mime === 'application/gzip')
      return 'archive';
    return 'description';
  }

  getPictureFilePath(file: file.IFile): string {
    return joinPath(this.endpoint, file.name);
  }

  isPicture(mime: string | undefined): boolean {
    if (!mime) {
      return false;
    }
    return mime.startsWith('image/');
  }
}

interface IFileDirectory {
  name: string;
  file?: file.IFile;
  children: IFileDirectory[];
  open?: boolean;
  icon: string;
}
