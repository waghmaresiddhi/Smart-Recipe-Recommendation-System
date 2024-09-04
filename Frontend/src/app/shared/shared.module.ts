import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings, RECAPTCHA_SETTINGS } from 'ng-recaptcha';
import { CommonCrudService } from './@services/common-crud.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySingleFilePickerComponent } from './@components/formly-single-file-picker/formly-single-file-picker.component';
import { FormlyMultipleFilePickerComponent } from './@components/formly-multiple-file-picker/formly-multiple-file-picker.component';
import { FormlySingleImagePickerComponent } from './@components/formly-single-image-picker/formly-single-image-picker.component';
import { FormlyMultipleImagePickerComponent } from './@components/formly-multiple-image-picker/formly-multiple-image-picker.component';
import { IsSvgPipe } from './@pipes/is-svg.pipe';
import { UrlToFilenamePipe } from './@pipes/url-to-filename.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RecaptchaModule,
        RecaptchaFormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatButtonModule,
        FormlyModule
    ],
    providers: [
        {
            provide: RECAPTCHA_SETTINGS,
            useValue: { siteKey: "6LdXnp4aAAAAAINfbYuj6Gj7RuMkHdlAfPGtMWQX" } as RecaptchaSettings,
        },
        CommonCrudService
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RecaptchaModule,
        RecaptchaFormsModule,
    ],
    declarations: [
        // FormlySingleFilePickerComponent,
        // FormlyMultipleFilePickerComponent,
        // UrlToFilenamePipe,
        // FormlySingleImagePickerComponent,
        // FormlyMultipleImagePickerComponent,
        // IsSvgPipe
    ]
})
export class SharedModule {
}
