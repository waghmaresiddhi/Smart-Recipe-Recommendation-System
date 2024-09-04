import { MatSnackBarConfig } from "@angular/material/snack-bar";
import { combineLatest, fromEvent, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FormFileInterface } from "app/shared/@interfaces/form-file.interface"
export class ImageSnippet {
    constructor(public src: string, public file: File) { }
}
export class SnackbarColor {
    public static errorClasses = ['bg-warn', 'text-white'];
    public static successClasses = ['bg-green-500', 'text-white'];
    public static infoClasses = ['bg-blue-600', 'text-white'];
}
export const snackBarBaseConfig: MatSnackBarConfig = {
    horizontalPosition: 'right',
    verticalPosition: 'top',
};

export const snackBarSuccessConfig: MatSnackBarConfig = {
    ...snackBarBaseConfig,
    panelClass: SnackbarColor.successClasses
};

export const snackBarErrorConfig: MatSnackBarConfig = {
    ...snackBarBaseConfig,
    panelClass: SnackbarColor.errorClasses
};

export const snackBarInfoConfig: MatSnackBarConfig = {
    ...snackBarBaseConfig,
    panelClass: SnackbarColor.infoClasses
};

export const processProfileImage = (imageInput) => {
    console.log("Processing from utils");

    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const selectedFile$ = fromEvent(reader, 'load').pipe(
        map((event: any) => {
            return {src:event.target.result,file:file} as FormFileInterface;
        })
    );


    const previewImage$ = new Observable<any>((observer) => {
        reader.onload = (event: any) => { // called once readAsDataURL is completed
            observer.next(event.target.result);
            observer.complete();
        };
    });

    return combineLatest([
        selectedFile$,
        previewImage$
    ]);
}
export const defaultImagePost = "assets/images/empty-image.png"

export const formDataToMultiPart = (data: any) => {
    let formData = new FormData();
    for (const [key, v] of Object.entries(data)) {
        let value = v as any;
        if (value?.hasOwnProperty('src') && value?.hasOwnProperty('file')) {
            // Processing for file
            if(value.file){
                formData.append(key, value.file as any);
            } 
            // else if(value.src == null){
            //     formData.append(key, null);
            // }
        }
        else if (typeof value == "string") {
            // Processing for string
            formData.append(key, value as any);
        } 
        else if (value == null) {
            // Processing for null values
            formData.append(key, "");
        } 
        else {
        // Processing for Json Object eg. {},[]
            formData.append(key, JSON.stringify(value as any));
        }
    }
    return formData
}