import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { AuthApiTokenResponse, AuthService, Tokens } from "./auth.service";


@Injectable()
export class MySocialAuthService {
    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService,
    ) { }
    signInWithGoogle(auth_token: string): Observable<AuthApiTokenResponse> {
        return this._httpClient.post<AuthApiTokenResponse>(`${environment.baseUrl}/social_auth/google/`, { auth_token: auth_token })
            .pipe(
                tap((response: AuthApiTokenResponse) => {
                    this._authService.setAccessAndRefreshTokens(response);
                    localStorage.setItem(Tokens.socialLogin,'true');
                })
                );
            }

            signInWithFacebook(auth_token: string): Observable<AuthApiTokenResponse> {
                return this._httpClient.post<AuthApiTokenResponse>(`${environment.baseUrl}/social_auth/facebook/`, { auth_token: auth_token })
                .pipe(
                    tap((response: AuthApiTokenResponse) => {
                        this._authService.setAccessAndRefreshTokens(response);
                        localStorage.setItem(Tokens.socialLogin,'true');
                })
            );
    }

    signInWithLinkedIN(auth_token: string): Observable<AuthApiTokenResponse> {
        return this._httpClient.post<AuthApiTokenResponse>(`${environment.baseUrl}/social_auth/linkedin/`, { auth_token: auth_token })
            .pipe(
                tap((response: AuthApiTokenResponse) => {
                    this._authService.setAccessAndRefreshTokens(response);
                    localStorage.setItem(Tokens.socialLogin, 'true');
                })
            );
    }

}
