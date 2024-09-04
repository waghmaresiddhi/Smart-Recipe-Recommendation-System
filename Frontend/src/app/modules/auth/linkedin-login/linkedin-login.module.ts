import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkedinLoginComponent } from './linkedin-login.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule, Route } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const routes: Route[] = [
  { path: '', component: LinkedinLoginComponent }
];

@NgModule({
  declarations: [
    LinkedinLoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MatProgressBarModule,
    MatSnackBarModule
  ]
})
export class LinkedinLoginModule { }
