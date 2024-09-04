import { Component, OnInit } from '@angular/core';
import { defaultImagePost, processProfileImage } from 'app/core/constants.utils';
import { FormFileInterface } from 'app/shared/@interfaces/form-file.interface';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'app-formly-single-image-picker',
  template: `
    <div class="profile-wrap w-40 mx-auto mt-4">
  <div class="img-placeholder">
    <img *ngIf="!(formImage?.src | isSvg)" [src]="formImage?.src"  
        class="h-40 w-40 object-contain shadow-md rounded-md">
</div>
    <mat-icon class="bg-primary edit-icon" svgIcon="heroicons_solid:camera"
      (click)="imageRef.click()" matPrefix></mat-icon>
  </div>
  <input formly-single-image-picker #imageRef type="file" [formControl]="formControl" 
    [formlyAttributes]="field" accept="image/*" 
  (change)="processFile(imageRef)" class="hidden">
  `,
  styles: [
    `
    .svg-placeholder {
    width: 10rem;
    height: 10rem;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNjY2MiPjwvcmVjdD4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNjY2MiPjwvcmVjdD4KPC9zdmc+);
}
  .img-placeholder {
      background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNjY2MiPjwvcmVjdD4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNjY2MiPjwvcmVjdD4KPC9zdmc+);
  }
  .svg-placeholder svg{
      width: 10rem;
      height: 10rem;
  }
    `
  ]
})
export class FormlySingleImagePickerComponent extends FieldType implements OnInit {

  constructor() { 
    super()
  }

  ngOnInit(): void {
    this.formImage = this.field.model[this.key as string]
  }

   
 

  formImage!: FormFileInterface;
  processFile(imageInput) {
    processProfileImage(imageInput).subscribe(([file, previewImage]) => {
      this.formImage = file;
    }
    )
  }
}
