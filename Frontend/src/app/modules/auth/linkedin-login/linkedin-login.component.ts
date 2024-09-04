import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { MySocialAuthService } from 'app/core/auth/my-social-auth.service';
import { snackBarErrorConfig } from 'app/core/constants.utils';

@Component({
  selector: 'app-linkedin-login',
  templateUrl: './linkedin-login.component.html',
  styleUrls: ['./linkedin-login.component.scss']
})
export class LinkedinLoginComponent implements OnInit {

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _mySocialAuthService: MySocialAuthService,
    private _snackBar: MatSnackBar,
  ) { }
  token: string;
  ngOnInit(): void {
    this.token = this._activatedRoute.snapshot.queryParamMap.get('code') as string;
    this._mySocialAuthService.signInWithLinkedIN(this.token).subscribe(
      (next) => {
        const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
        this._router.navigateByUrl(redirectURL);
      },
      (err) => {
        this._snackBar.open(err.error.detail, 'Close', snackBarErrorConfig);
        this._router.navigateByUrl('/sign-in');
      }
    );
  }

}
