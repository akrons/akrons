import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';

import { CoreModule, joinPath } from '@akrons/core';
import { CmsModule } from '@akrons/cms';
import { CmsDefaultModule } from '@akrons/cms-default';
import { CmsBackendModule } from '@akrons/cms-backend';
import { CmsDefaultBackendModule } from '@akrons/cms-default-backend';
import { BackendComponent } from './backend/backend.component';
import { FilesBackendModule } from '@akrons/files-backend';
import { MatDialogModule } from '@angular/material/dialog';
@NgModule({
  declarations: [
    AppComponent,
    BackendComponent
  ],
  imports: [
    MatDialogModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule.forRoot({
      production: environment.production,
      titlePrefix: 'Akrons-Test'
    }),
    CmsModule.forRoot({
      endpoint: joinPath(environment.host, '/api/page'),
    }),
    CmsDefaultModule,
    CmsBackendModule.forRoot({
      endpoint: joinPath(environment.host, '/api/backend/page')
    }),
    CmsDefaultBackendModule,
    FilesBackendModule.forRoot({
      endpoint: joinPath(environment.host, '/api/file'),
      backendEndpoint: joinPath(environment.host, '/api/backend/file')
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
