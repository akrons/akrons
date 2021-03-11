import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { cms } from '@akrons/types';
import { PageBackendService } from '../../services/page-backend.service';

@Component({
  selector: 'akrons-cms-backend-page-editor',
  templateUrl: './page-editor.component.html',
  styleUrls: ['./page-editor.component.scss']
})
export class PageEditorComponent implements OnInit {

  selectedPageId: string;

  constructor(
    private pageBackendService: PageBackendService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    public selectedPage: cms.IPage,
  ) {
    this.selectedPageId = selectedPage.id;
  }

  ngOnInit(): void {
  }

  async save(): Promise<void> {
    await this.pageBackendService.savePage(this.selectedPageId, this.selectedPage);
    this.dialogRef.close();
  }

  discardChanges(): void {
    this.pageBackendService.getAll$();
    this.dialogRef.close();
  }

}
