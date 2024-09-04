import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { FormFileInterface } from 'app/shared/@interfaces/form-file.interface';

@Component({
  selector: 'app-formly-single-file-picker',
  template: `
    <input formly-single-file-picker type="file" #fileRef [formControl]="formControl" 
    [formlyAttributes]="field" (change)="onFileChange(fileRef.files[0])" class="hidden" >
    <button class="mb-2 rounded-md" mat-raised-button (click)="fileRef.click()">
      <span *ngIf="!selectedFile?.file">
        <ng-container  *ngIf="selectedFile?.src;else defaultFileLabel">
          Change File
        </ng-container>
        <ng-template #defaultFileLabel>
          Select File
        </ng-template>
      </span>
      <span *ngIf="selectedFile?.file">
        Selected File: {{selectedFile?.file?.name}}
      </span>
      <!-- <span>Change Current File: {{getFileName(selectedFile?.src)}}</span> -->
    </button>
    <div>
      <span *ngIf="selectedFile?.src">Current File:
        <a class="underline" target="_blank" [href]="selectedFile?.src">
          {{selectedFile?.src | urlToFilename}}
        </a>
        <!-- <mat-icon [svgIcon]="'heroicons_solid:x-circle'"></mat-icon> -->
      </span>
    </div>
  `,
  styles: [
  ]
})
export class FormlySingleFilePickerComponent extends FieldType implements OnInit {

  constructor() {
    super()
  }

  selectedFile: FormFileInterface;

  ngOnInit(): void {
    this.selectedFile = this.field.model[this.key as string];
  }

  onFileChange(event) {
    this.selectedFile = { src: this.selectedFile?.src, file: event };
  }

  // getFileName(url) {
  //   if (url) {
  //     var m = url.toString().match(/\/([^\/?#]+)[^\/]*$/);
  //     if (m && m.length > 1) {
  //       return m[1];
  //     }
  //   }
  //   return "";
  // }

  clearFile(){

  }
}
