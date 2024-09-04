import { Directive } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { FormFileInterface } from 'app/shared/@interfaces/form-file.interface';

@Directive({
  // tslint:disable-next-line
  selector: 'input[formly-single-image-picker]',
  host: {
    '(change)': 'processFile($event.target.files[0])',
    '(blur)': 'onTouched()',
    '(clear)':'clearFile()',
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: FormlySingleImagePickerValueAccessor, multi: true },
  ],
})
// https://github.com/angular/angular/issues/7341
export class FormlySingleImagePickerValueAccessor implements ControlValueAccessor {
  value: any;
  onChange = (_) => { };
  onTouched = () => { };

  writeValue(value) { 
    // this = obj;
  }
  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }

  processFile(file) {
    this.onChange({
      file: file,
      src: null
    } as FormFileInterface)
  }

  clearFile(){
    this.onChange({
      file: null,
      src: null
    } as FormFileInterface)
  }
}