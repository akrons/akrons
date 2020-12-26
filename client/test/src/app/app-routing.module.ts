import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageComponent } from '@akrons/cms';
import { FileListComponent } from '@akrons/files-backend';
import { BackendComponent } from './backend/backend.component';
import { LoginComponent, ChangePasswordComponent } from '@akrons/auth';
import { GroupListComponent, UserListComponent } from '@akrons/auth-backend';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home'},
  { path: 'login', component: LoginComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'backend', children: [
    { path: 'users', component: UserListComponent },
    { path: 'groups', component: GroupListComponent },
    { path: 'edit', component: BackendComponent },
    { path: 'file', component: FileListComponent },
  ] },
  { path: '**', component: PageComponent }
];  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
