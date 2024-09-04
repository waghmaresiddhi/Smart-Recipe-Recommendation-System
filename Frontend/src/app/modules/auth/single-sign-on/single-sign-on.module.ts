import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleSignOnComponent } from './single-sign-on.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [
    SingleSignOnComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    MatSnackBarModule
  ],
  exports: [
    SingleSignOnComponent
  ]
})
export class SingleSignOnModule { }
