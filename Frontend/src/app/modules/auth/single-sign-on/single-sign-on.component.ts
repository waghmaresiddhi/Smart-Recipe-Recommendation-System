import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { MySocialAuthService } from 'app/core/auth/my-social-auth.service';
import { snackBarErrorConfig } from 'app/core/constants.utils';
import { DestroySubscribers } from 'app/core/decorators/destroy-subscibers';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-single-sign-on',
  templateUrl: './single-sign-on.component.html',
  styleUrls: ['./single-sign-on.component.scss']
})
@DestroySubscribers()
export class SingleSignOnComponent implements OnInit {

  constructor(
    private _socialAuthService: SocialAuthService,
    private _mySocialAuthService: MySocialAuthService,
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _httpClient: HttpClient,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }
  // For adding subscribers so that it can be destroyed by @DestroySubscribers()
  public subscribers: any = {};
  googleLoading = false;
  facebookLoading = false;

  signInWithGoogle() {
    this.googleLoading = true;
    this._socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.subscribers.googleSocialAuth = this._socialAuthService.authState.pipe(distinctUntilChanged()).subscribe((user) => {
      if (user) {
        this.subscribers.googleApi = this._mySocialAuthService.signInWithGoogle(user.idToken).subscribe(
          (next) => {
            if (next) {
              this.googleLoading = false;
              const redirectURL = this._activateRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
              this._router.navigateByUrl(redirectURL);
            }
            this.googleLoading = false;
          },
          (err) => {
            this._snackBar.open(err.error.detail, 'Close', snackBarErrorConfig);
          }
        );
      }
    });
  }

  signInWithFacebook() {
    this.facebookLoading = true;
    this._socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.subscribers.fbSocialAuth = this._socialAuthService.authState.pipe(distinctUntilChanged()).subscribe((user) => {
      if (user) {
        this.subscribers.fbApi = this._mySocialAuthService.signInWithFacebook(user.authToken).subscribe(
          (next) => {
            if (next) {
              this.facebookLoading = false;
              const redirectURL = this._activateRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
              this._router.navigateByUrl(redirectURL);
            }
            this.facebookLoading = false;
          },
          (err) => {
            this._snackBar.open(err.error.detail, 'Close', snackBarErrorConfig);
          }
        );
      }
    });
  }

  signInWithLinkedIn() {
    const linkedInURI = 'https://www.linkedin.com/oauth/v2/authorization';
    const scope = 'scope=r_liteprofile%20r_emailaddress';
    const scheme = location.href.split(":")[0];
    const redirectURI = `${scheme}://${location.host}/linkedin-login/`;
    // console.log(redirectURI);
    const clientID = '779gawjz0leuex';
    return `${linkedInURI}?${scope}&redirect_uri=${encodeURI(redirectURI)}&client_id=${clientID}&response_type=code&state=login`;

  }
}
