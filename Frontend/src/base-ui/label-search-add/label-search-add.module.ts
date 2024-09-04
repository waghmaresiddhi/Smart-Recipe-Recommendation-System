import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelSearchAddComponent } from './label-search-add.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule
  ],
  declarations: [LabelSearchAddComponent],
  exports: [
    LabelSearchAddComponent,
  ]
})
export class LabelSearchAddModule { }
