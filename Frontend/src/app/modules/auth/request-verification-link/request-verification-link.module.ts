import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestVerificationLinkComponent } from './request-verification-link.component';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';

const routes: Route[] = [
  { path: '', component: RequestVerificationLinkComponent }
];

@NgModule({
  declarations: [
    RequestVerificationLinkComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FuseCardModule,
    FuseAlertModule,
    SharedModule,
  ]
})
export class RequestVerificationLinkModule { }
