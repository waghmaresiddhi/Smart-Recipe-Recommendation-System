import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

export interface ChangePasswordApiBody {
  old_password: string;
  new_password: string;
}
export interface ChangePasswordApiResponse {
  status: string;
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  constructor(private _http: HttpClient) { }

  changePassword(form: ChangePasswordApiBody) {
    return this._http.patch<ChangePasswordApiResponse>(`${environment.apiUrl}/user/change_password/`, form);
  }
}
