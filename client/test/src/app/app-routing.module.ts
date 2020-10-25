import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageComponent } from '@akrons/cms';
import { FileListComponent } from '@akrons/files-backend';
import { BackendComponent } from './backend/backend.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home'},
  { path: 'edit', component: BackendComponent },
  { path: 'file', component: FileListComponent },
  { path: '**', component: PageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
