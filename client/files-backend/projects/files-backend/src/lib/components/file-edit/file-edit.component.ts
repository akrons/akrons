import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BackendFileService } from '../../services/backend-file.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-backend-file-edit',
  templateUrl: './file-edit.component.html',
  styleUrls: ['./file-edit.component.scss']
})
export class FileEditComponent implements OnInit {

  fileCachePolicyOptions = [
    {name: 'Nicht Cachen', value: 0},
    {name: '1 Stunde', value: 3600},
    {name: '1 Tag', value: 86400},
    {name: '1 Woche', value: 604800},
    {name: '1 Monat', value: 2628000},
    {name: '2 Monat', value: 5256000},
    {name: '6 Monat', value: 15768000},
    {name: '1 Jahr', value: 31536000},
  ];

  editForm: FormGroup;
  id: string;

  constructor(
    private formBuilder: FormBuilder,
    private fileService: BackendFileService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) private fileId: string,
  ) { }

  ngOnInit(): void {
    this.fileService.get$(this.fileId)
      .subscribe({
        next: (file) => {
          this.editForm = this.formBuilder.group({
            name: file.name,
            permission: file.permission,
            mimeType: file.mimeType,
            cachePolicy: file.cachePolicy || 0,
          });
          this.id = file.id;
        }
      });
  }

  async save(): Promise<void> {
    await this.fileService.update$(this.fileId, this.editForm.value).toPromise();
    await this.fileService.refreshSubscriber();
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
