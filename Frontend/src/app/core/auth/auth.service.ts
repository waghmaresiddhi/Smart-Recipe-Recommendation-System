import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment';
import { SocialAuthService } from 'angularx-social-login';
import { Router } from '@angular/router';

export enum Tokens {
    accessToken = 'access',
    refreshToken = 'refresh',
    socialLogin = 'social-login'
}

export interface AuthApiTokenResponse {
    access: string;
    refresh: string;
}

export interface SignUp {
    email: string;
    name: string;
    password: string;
    recaptcha: string;
}
@Injectable()
export class AuthService {
    private _authenticated: boolean = false;


    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private _router: Router,
        private socialAuthService: SocialAuthService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem(Tokens.accessToken, token);
    }

    get accessToken(): string {
        return localStorage.getItem(Tokens.accessToken) ?? '';
    }

    /**
     * Setter & getter for access token
     */
    set refreshToken(token: string) {
        localStorage.setItem(Tokens.refreshToken, token);
    }

    get refreshToken(): string {
        return localStorage.getItem(Tokens.refreshToken) ?? '';
    }

    setAccessAndRefreshTokens(token: AuthApiTokenResponse) {
        this.accessToken = token.access;
        this.refreshToken = token.refresh;
    }

    clearAccessAndRefreshToken() {
        if (localStorage.getItem(Tokens.accessToken)) {
            localStorage.removeItem(Tokens.accessToken);
        }
        if (localStorage.getItem(Tokens.refreshToken)) {
            localStorage.removeItem(Tokens.refreshToken);
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post(`${environment.baseUrl}/auth/forgot_password/`, { email: email });
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(uidb64: string, token: string, password: string): Observable<any> {
        return this._httpClient.patch(`${environment.baseUrl}/auth/reset_password/`,
            {
                password: password,
                token: token,
                uidb64: uidb64
            }
        );
    }

    verifyResetPasswordToken(uidb64: string, token: string) {
        return this._httpClient.get(`${environment.baseUrl}/auth/verify_reset_password_tokens/${uidb64}/${token}`);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(environment.baseUrl + '/auth/login/', credentials).pipe(
            tap((response: AuthApiTokenResponse) => {
                this.setAccessAndRefreshTokens(response);
            }),
            switchMap((response: AuthApiTokenResponse) => {

                // Store the access token in the local storage


                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user 0
                // this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Renew token
        return this._httpClient.post(`${environment.baseUrl}/auth/refresh/`, {
            refresh: this.refreshToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: AuthApiTokenResponse) => {

                // Store the access token in the local storage
                this.accessToken = response.access;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                // this._userService.user = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        this.clearAccessAndRefreshToken();
        // Set the authenticated flag to false
        this._authenticated = false;
        const socialLogin = localStorage.getItem(Tokens.socialLogin) === 'true';
        if (socialLogin) {
            console.log("Sign Out Social Login");
            localStorage.removeItem(Tokens.socialLogin);
            try {
                this.socialAuthService.signOut();
            } catch {
                console.log("Social Auth Warning");
            }
        }
        this._router.navigateByUrl('/sign-in');
        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(signUpData: SignUp): Observable<any> {
        return this._httpClient.post(`${environment.baseUrl}/auth/register/`, signUpData);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/user/register/`, credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }
        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }

    verifyEmailIdViaToken(token: string) {
        return this._httpClient.get(`${environment.baseUrl}/auth/verify_email/?token=${token}`);
    }

    requestEmailVerificationLink(email: string) {
        return this._httpClient.post(`${environment.baseUrl}/auth/request_verification_link/`, { email: email });
    }

    getNewAccessToken(): Observable<{ access: string }> {
        const refreshToken = localStorage.getItem(Tokens.refreshToken);
        return this._httpClient.post<{ accessToken: string; refreshToken: string }>(
            `${environment.baseUrl}/auth/refresh/`,
            {
                refresh: refreshToken
            }).pipe(
                tap((response: any) => {
                    localStorage.setItem(Tokens.accessToken, response.access);
                })
            );
    }
}
