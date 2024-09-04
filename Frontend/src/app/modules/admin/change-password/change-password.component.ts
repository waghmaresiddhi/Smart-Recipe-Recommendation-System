import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { snackBarBaseConfig, SnackbarColor, snackBarErrorConfig, snackBarSuccessConfig } from 'app/core/constants.utils';
import { ChangePasswordApiBody, ChangePasswordService } from './change-password.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  constructor(
    private _changePasswordService: ChangePasswordService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.changePasswordForm = this._formBuilder.group({
      old_password: ['', [Validators.required]],
      new_password: ['', [Validators.required]]
    });
  }
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;

  changePwd() {
    this.changePasswordForm.disable();
    this.showAlert = false;
    this._changePasswordService.changePassword(this.changePasswordForm.value).subscribe(
      (next) => {
        this._router.navigate(['/sign-out']);
        this._snackBar.open(next.message, 'Close', snackBarSuccessConfig);
      },
      (err) => {
        this.alert = {
          type: 'error',
          message: err.error.error
        };

        // Show the alert
        this.showAlert = true;
        // this._snackBar.open(err.error.error, 'Close', snackBarErrorConfig);
      }
    ).add(
      () => {
        this.changePasswordForm.enable();
      }
    );
  }
}
