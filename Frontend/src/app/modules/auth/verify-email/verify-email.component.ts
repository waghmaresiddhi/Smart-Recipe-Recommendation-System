import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class VerifyEmailComponent implements OnInit {

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _router: Router,
  ) { }
  token: string;
  showAlert = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  ngOnInit(): void {
    this.token = this._activatedRoute.snapshot.paramMap.get('token') as string;
    this._authService.verifyEmailIdViaToken(this.token).subscribe(
      (next) => {
        // this._router.navigate([]);
        this.showAlert = true;
        this.alert = { type: "success", message: "Email Verified Successfully!" };
        setTimeout(() => {
          this._router.navigate(['/sign-in']);
        }, 5000);
      },
      (err) => {
        this.showAlert = true;
        this.alert = { type: "error", message: "Link Expired / Token Tampered" };
      }
    );
  }

}
