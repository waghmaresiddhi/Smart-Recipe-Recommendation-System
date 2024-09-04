import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { FieldType } from '@ngx-formly/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { FormFileMultipleInterface } from 'app/shared/@interfaces/form-file.interface';

@Component({
  selector: 'app-formly-multiple-image-picker',
  template: `
    <div class="w-full mx-auto">
        <input formly-multiple-image-picker #multiFileInput type="file" accept="image/*"
        [formControl]="formControl" 
        [formlyAttributes]="field" 
        multiple class="hidden" (change)="processFile($event)">
        <button class="fuse-mat-button-medium rounded-md" mat-flat-button [color]="'primary'"
          (click)="multiFileInput.click()">
          <span>Select Images</span>
        </button>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div *ngFor="let file of selectedFiles;let i = index" class="profile-wrap " >
            <mat-icon (click)="deleteSingleImage(file.id)" class="bg-red-500 edit-icon" svgIcon="heroicons_solid:trash" matPrefix>
            </mat-icon>
            <img  class="h-60 object-cover shadow rounded-md" [src]="file.url" alt="">
          </div>
        </div>
    </div>
  `,
  styles: [
  ]
})
export class FormlyMultipleImagePickerComponent extends FieldType implements OnInit {

  constructor(
    private _httpClient: HttpClient
  ) {
    super()
  }

  ngOnInit(): void {
    console.log(this.field.model[this.key as string]);
    
    this.selectedFiles = this.field.model[this.key as string]
  }
  selectedFiles: FormFileMultipleInterface[] = []

  processFile(imageInput: any) { 
   
    console.log(this.field.model[this.key as string]);
    let selectedBannersFile = imageInput.target.files;
    if (selectedBannersFile && selectedBannersFile[0]) {
      this.uploadBannerImagesToFileStorage(selectedBannersFile).subscribe((next: any) => {
        let processResponse = next.map(obj => {
          return {
            id:obj.id,
            url:obj.image
          }
        })
        this.setSelectedFile([
          ...this.selectedFiles,
          ...processResponse,
        ])
        
      });
    }
  }

  uploadBannerImagesToFileStorage(fileList: FileList) {
    let templateOpts = this.field.templateOptions;
    const form = new FormData();
    let count = 0;
    for (let i = 0; i < fileList.length; i++) {
      form.append(templateOpts.filePrefix + count, fileList[i]);
      count++;
    }

    return this._httpClient.post(environment.apiUrl + templateOpts.apiUrl, form);
  }

  deleteSingleImage(id) {
    let templateOpts = this.field.templateOptions;
    return this._httpClient.delete(environment.apiUrl + templateOpts.apiUrl + id + '/')
    .subscribe(next => {
      this.setSelectedFile(this.selectedFiles.filter(obj => obj.id != id));
    });
  }

  setSelectedFile(newSelected){
    this.selectedFiles = newSelected;
    this.formControl.patchValue(this.selectedFiles);
  }
}
