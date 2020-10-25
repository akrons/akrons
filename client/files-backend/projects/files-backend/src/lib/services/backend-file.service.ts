import { Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { HttpService, IHttpService } from '@akrons/core';
import { FILES_BACKEND_HOST_INJECTOR } from '../injectors';

@Injectable({
  providedIn: 'root'
})
export class BackendFileService {

  private http: IHttpService;

  private serviceSubject$: Subject<IFile[]> = new Subject();

  constructor(
    @Inject(FILES_BACKEND_HOST_INJECTOR)
    endpoint: string,
    http: HttpService,
  ) {
    this.http = http.endpoint(endpoint);
  }

  getAll$(): Observable<IFile[]> {
    this.http.get<IFile[]>().subscribe({
      next: value => this.serviceSubject$.next(value),
    });
    return this.serviceSubject$;
  }

  async refreshSubscriber(): Promise<void> {
    await this.getAll$().pipe(take(1)).toPromise();
  }

  get$(id: string): Observable<IFile> {
    return this.http.get<IFile>(id);
  }

  update$(id: string, updated: IFile): Observable<void> {
    return this.http.post<void>(id, updated);
  }

  delete$(id: string): Observable<void> {
    return this.http.delete<void>(id);
  }

  getSpaceUsage$(): Observable<{ result: number, limit?: number }> {
    return this.http.get('usage');
  }
}

export interface IFile {
  id: string;
  name: string;
  permission: string;
  mimeType: string;
  cachePolicy: number;
}
