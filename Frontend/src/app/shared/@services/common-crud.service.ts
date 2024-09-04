import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class CommonCrudService {

  constructor(private _http: HttpClient) { }

  getAllItems(url: string, config: { pageSize: number, pageNumber: number, search: string }) {

    const params = new HttpParams()
      .set('page_size', config.pageSize.toString())
      .set('page', config.pageNumber.toString())
      .set('search', config.search)
    return this._http.get<any>(`${environment.apiUrl}${url}`, { params: params });
  }

  getSingleItem(url: string, config: { slugOrID: string | number }) {
    return this._http.get<any>(`${environment.apiUrl}${url}${config.slugOrID}/`);
  }

  createSingleItem(url: string, config: { data: any, files: Object }) {

    if (config.files) {
      console.log("Files Passed");
      const form = new FormData();
      let count = 0;
      for (let key in config.files) {
        if (config.files[key]) {
          form.append(key, config.files[key])
          count++;
        }
      }
      if (count > 0) {
        return this._http.post<any>(`${environment.apiUrl}${url}`, config.data).pipe(
          switchMap(data => {
            let slugOrId = "0";
            if (data['slug']) {
              slugOrId = data['slug'];
            } else {
              slugOrId = data['id'];
            }
            return this._http.patch<any>(`${environment.apiUrl}${url}${slugOrId}/`, form)
          })
        );
      }
    }
    return this._http.post<any>(`${environment.apiUrl}${url}`, config.data);
  }

  updateSingleItem(url: string, config: { data: any, files: Object, slugOrId: string | number }) {

    if (!config.slugOrId) {
      return of(null);
    }
    if (config.files) {
      console.log("Files Passed");
      const form = new FormData();
      let count = 0;
      for (let key in config.files) {
        if (config.files[key]) {
          form.append(key, config.files[key])
          count++;
        }
      }
      if (count > 0) {
        return this._http.patch<any>(`${environment.apiUrl}${url}${config.slugOrId}/`, config.data).pipe(
          switchMap(data => {
            let slugOrId = "0";
            if (data['slug']) {
              slugOrId = data['slug'];
            } else {
              slugOrId = data['id'];
            }
            return this._http.patch<any>(`${environment.apiUrl}${url}${slugOrId}/`, form)
          })
        );
      }
    }
    return this._http.patch<any>(`${environment.apiUrl}${url}${config.slugOrId}/`, config.data);

  }

  deleteItem(url: string, config: { slugOrId: string | number }) {
    return this._http.delete<any>(`${environment.apiUrl}${url}${config.slugOrId}/`);
  }
}
