import { Component, OnInit, Inject } from '@angular/core';
import { BackendFileService, IFile } from '../../services/backend-file.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-backend-file-delete',
  templateUrl: './file-delete.component.html',
  styleUrls: ['./file-delete.component.scss']
})
export class FileDeleteComponent implements OnInit {

  constructor(
    private fileService: BackendFileService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public file: IFile,
  ) { }

  ngOnInit(): void {
  }

  async save(): Promise<void> {
    await this.fileService.delete$(this.file.id).toPromise();
    await this.fileService.refreshSubscriber();
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
