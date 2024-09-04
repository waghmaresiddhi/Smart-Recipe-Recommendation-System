import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

export interface ProfileApiResponse {
  email: string;
  name: string;
  profile_image: string;
}
export interface ProfileApiBody {
  status: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private _http: HttpClient) { }

  profile$ = this._http.get<ProfileApiResponse>(`${environment.apiUrl}/user/profile/`);


  updateProfile(data: ProfileApiResponse, image: File) {
    const form = new FormData();
    if (image) {
      form.append('profile_image', image);
    }
    form.append('name', data.name);
    return this._http.patch<ProfileApiBody>(`${environment.apiUrl}/user/profile/`, form);
  }

}
