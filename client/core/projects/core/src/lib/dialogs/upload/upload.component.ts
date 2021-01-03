import { Component, ViewChild, ElementRef, Inject, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { HttpService } from '../../services/http/http.service';
import { joinPath } from '../../join-path';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

  isUploading = false;
  progress$: Subject<number> = new Subject();
  error = false;

  cancelUpload: Subject<void> = new Subject();

  @ViewChild('fileUpload') fileUpload: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: IUploadDialogData,
    private http: HttpService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {

  }

  abort(): void {
    this.cancelUpload.next();
    this.dialogRef.close();
  }

  upload(): void {
    this.isUploading = true;
    this.uploadToEndpoint$(this.data.uploadEndpoint)
      .pipe(takeUntil(this.cancelUpload))
      .subscribe({
        next: value => {
          if (value.type === 'progress') {
            this.progress$.next(value.progress);
            this.changeDetectorRef.detectChanges();
          } else {
            this.isUploading = false;
            this.uploadComplete(value.response);
          }
        },
        error: (err) => {
          this.isUploading = false;
          this.error = true;
          this.changeDetectorRef.detectChanges();
          throw err;
        }
      });
  }

  uploadComplete(result: string): void {
    this.dialogRef.close(joinPath(this.data.fileEndpoint, result));
  }

  uploadToEndpoint$(endpoint: string): Observable<{ type: 'progress', progress: number } | { type: 'response', response: string }> {
    return new Observable(observer => {
      const file = this.fileUpload.nativeElement.files[0];
      const formData = new FormData();
      const request = new XMLHttpRequest();
      formData.append((this.data.filenamePrefix || '') + file.name, file);
      request.onerror = (err => { throw err; });
      request.onload = () => {
        observer.next({ type: 'progress', progress: 100 });
        observer.complete();
      };
      request.upload.onprogress = (event) => {
        var p = Math.round(100 / event.total * event.loaded);
        observer.next({ type: 'progress', progress: p });
      };
      request.onabort = (e) => {
        console.log('aborted upload', e);
        observer.complete();
      };
      request.open('POST', endpoint);

      const headers = this.http.addHeaders().headers;
      headers.keys().forEach(header => {
        headers.getAll(header).forEach(value => {
          request.setRequestHeader(header, value);
        });
      });

      request.send(formData);
      request.onreadystatechange = function (): void {
        if (request.readyState === 4) {
          if (request.status - (request.status % 100) !== 200) {
            observer.error(new HttpErrorResponse({ status: request.status, statusText: request.response }));
          } else {
            observer.next({ type: 'response', response: request.response });
          }
        }
      };
      return () => request.abort();
    });
  }

  getSelectedFiles(): string | undefined {
    if (!this.fileUpload?.nativeElement.files) return '';
    let result = [];
    for (let i = 0; i < this.fileUpload?.nativeElement.files.length || 0; i++) {
      result.push(this.fileUpload?.nativeElement.files[i].name);
    }
    return result.join(', ');
  }

  selectFile(): void {
    this.fileUpload?.nativeElement.click();
  }

  get noFileSelected(): boolean {
    return (this.fileUpload?.nativeElement.files.length || 0) === 0;
  }

  detectChanges(): void {
    this.changeDetectorRef.detectChanges();
  }
}

export interface IUploadDialogData {
  title: string;
  uploadEndpoint: string;
  fileEndpoint: string;
  filenamePrefix?: string;
}
