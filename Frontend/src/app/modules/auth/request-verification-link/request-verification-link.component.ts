import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-request-verification-link',
  templateUrl: './request-verification-link.component.html',
  styleUrls: ['./request-verification-link.component.scss']
})
export class RequestVerificationLinkComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _activatedRoute: ActivatedRoute,
  ) { }

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;
  requestVerificationLinkForm: FormGroup;
  @ViewChild('requestVerificationLinkFormNgForm') requestVerificationLinkFormNgForm: NgForm;
  ngOnInit(): void {
    this.requestVerificationLinkForm = this._fb.group(
      {
        email: ['', [Validators.required, Validators.email]]
      }
    );
    if (this._activatedRoute.snapshot.paramMap.get('email')) {
      const email = this._activatedRoute.snapshot.paramMap.get('email') as string;
      this.requestVerificationLinkForm.patchValue({ email: email });
    }
  }

  requestVerificationLink() {
    // this._authService.requestEmailVerificationLink()
    // Return if the form is invalid
    if (this.requestVerificationLinkForm.invalid) {
      return;
    }

    // Disable the form
    this.requestVerificationLinkForm.disable();

    // Hide the alert
    this.showAlert = false;

    // Forgot password
    this._authService.requestEmailVerificationLink(this.requestVerificationLinkForm.get('email').value)
      .pipe(
        finalize(() => {

          // Re-enable the form
          this.requestVerificationLinkForm.enable();

          // Reset the form
          this.requestVerificationLinkFormNgForm.resetForm();

          // Show the alert
          this.showAlert = true;
        })
      )
      .subscribe(
        (response: any) => {
          let msg = 'Success';
          if (response.message) {
            msg = response.message;
          }
          // Set the alert
          this.alert = {
            type: 'success',
            message: msg
          };
        },
        (response) => {

          // Set the alert
          this.alert = {
            type: 'error',
            message: 'Email not found!'
          };
        }
      );
  }
}
