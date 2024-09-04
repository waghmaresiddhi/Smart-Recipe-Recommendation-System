import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService, Tokens } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /**
   * Constructor
   */
  constructor(private _authService: AuthService) {
  }

  /**
   * Intercept
   *
   * @param req
   * @param next
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem(Tokens.accessToken);
    return next.handle(this.addAuthorizationHeader(req, accessToken)).pipe(
      catchError(err => {
        // Check if access token expire error message is present
        const accessTokenErrorMsg = err.error['code'] ?? '';

        // in case of 401 http error
        if (
          err instanceof HttpErrorResponse &&
          err.status === 401 &&
          !req.url.endsWith('/refresh/') &&
          accessTokenErrorMsg == 'token_not_valid'
        ) {
          // get refresh tokens
          const refreshToken = localStorage.getItem(Tokens.refreshToken);
          // if there are tokens then send refresh token request
          if (refreshToken && accessToken) {
            return this.getNewAccessToken(req, next);
          }

          // otherwise logout and redirect to login page
          return this._authService.signOut();
        }

        // in case of 403 http error (refresh token failed)
        // if (err instanceof HttpErrorResponse && err.status === 401) {
        //   // logout and redirect to login page
        //   return this._authService.signOut();
        // }
        // if error has status neither 401 nor 403 then just return this error
        return throwError(err);
      })
    );
  }

  private refreshingInProgress: boolean = false;
  private accessTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");


  private getNewAccessToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.refreshingInProgress) {
      this.refreshingInProgress = true;
      this.accessTokenSubject.next("");
      console.log("REFRESHING");

      return this._authService.getNewAccessToken().pipe(
        switchMap((res) => {
          this.refreshingInProgress = false;
          this.accessTokenSubject.next(res.access);
          // repeat failed request with new token
          return next.handle(this.addAuthorizationHeader(request, res.access));
        })
      );
    } else {
      // wait while getting new token
      return this.accessTokenSubject.pipe(
        filter(token => token != ""),
        take(1),
        switchMap(token => {
          // repeat failed request with new token
          return next.handle(this.addAuthorizationHeader(request, token));
        }));
    }
  }

  private addAuthorizationHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    if (token) {
      return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
    return request;
  }
}
