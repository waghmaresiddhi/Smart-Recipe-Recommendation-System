import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyEmailComponent } from './verify-email.component';
import { Route, RouterModule } from '@angular/router';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import {MatProgressBarModule} from '@angular/material/progress-bar';


const routes: Route[] = [
  {
    path: '',
    component: VerifyEmailComponent
  }
];

@NgModule({
  declarations: [
    VerifyEmailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseAlertModule,
    MatProgressBarModule,
    SharedModule,
  ]
})
export class VerifyEmailModule { }
