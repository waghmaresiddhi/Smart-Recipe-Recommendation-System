import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseAlertType } from '@fuse/components/alert';
import { ImageSnippet, processProfileImage, snackBarErrorConfig, snackBarSuccessConfig } from 'app/core/constants.utils';
import { tap } from 'rxjs/operators';
import { ProfileService } from './profile.service';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;
  profileUpdateForm: FormGroup;

  selectedFile!: ImageSnippet;

  profileImage = 'assets/images/empty user.png';

  processFile(imageInput: any) {
    processProfileImage(imageInput).subscribe(
      ([selectedFile, profileImage]) => {
        this.selectedFile = selectedFile;
        this.profileImage = profileImage;
      })
  }

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _profileService: ProfileService,
    private _snackBar: MatSnackBar,
    private _userService: UserService
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.profileUpdateForm = this._formBuilder.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email,]],
      name: ['', [Validators.required,]],
      // profile_image: ['', [Validators.required,]]
    });
  }

  profile$ = this._profileService.profile$.pipe(
    tap(
      (data) => {
        this.profileUpdateForm.patchValue({
          email: data.email,
          name: data.name,
        });
        console.log(data.profile_image);
        if (data.profile_image) {
          this.profileImage = data.profile_image;
        }
      },
      (err) => { }
    )
  );

  updateProfile() {
    this.profileUpdateForm.disable();
    const data = this.profileUpdateForm.value;
    this._profileService.updateProfile(data, this.selectedFile?.file).subscribe(
      (next: any) => {
        this._userService.user = next;
        this._snackBar.open('Profile update successfully', 'Close', snackBarSuccessConfig);
      },
      (err) => {
        this._snackBar.open('Unable to save profile', 'Close', snackBarErrorConfig);
      }
    ).add(
      () => {
        this.profileUpdateForm.enable();
        this.profileUpdateForm.get('email').disable();
      }
    );
  }
}
