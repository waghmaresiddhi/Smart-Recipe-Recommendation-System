import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ECommerceService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  static convertOpts(valueKey, labelKey) {
    return map((next: any) => {
      return next.map(obj => {
        return {
          value: obj[valueKey],
          label: obj[labelKey]
        };
      });
    });
  }

  getMobileFeatures() {
    return this._httpClient.get(`${environment.apiUrl}/ecommerce/mobile/`);
  }

  getTags() {
    return this._httpClient.get(`${environment.apiUrl}/ecommerce/tag/`).pipe(
      ECommerceService.convertOpts('id', 'name')
    ) as any;
  }

  getRamUnit() {
    return this._httpClient.get(`${environment.apiUrl}/ecommerce/ram_unit/`).pipe(
      ECommerceService.convertOpts('id', 'unit')
    ) as any;
  }

  getBrand() {
    return this._httpClient.get(`${environment.apiUrl}/ecommerce/brand/`).pipe(
      ECommerceService.convertOpts('id', 'name')
    ) as any;
  }

  getUsbPort() {
    return this._httpClient.get(`${environment.apiUrl}/ecommerce/usb_port/`).pipe(
      ECommerceService.convertOpts('id', 'name')
    ) as any;
  }

  getScreenType() {
    return this._httpClient.get(`${environment.apiUrl}/ecommerce/screen_type/`).pipe(
      ECommerceService.convertOpts('id', 'name')
    ) as any;
  }

  getColor() {
    return this._httpClient.get(`${environment.apiUrl}/ecommerce/color/`).pipe(
      ECommerceService.convertOpts('id', 'name')
    ) as any;
  }


  
  getList(){
    return this._httpClient.get(`${environment.apiUrl}/ecommerce/mobile/`);
  }
  
  getSingleMobile(slug){
    return this._httpClient.get(`${environment.apiUrl}/ecommerce/mobile/${slug}/`);
  }

  saveMobile(data){
    return this._httpClient.post(`${environment.apiUrl}/ecommerce/mobile/`,data);
  }

  updateMobile(slug,data){
    return this._httpClient.patch(`${environment.apiUrl}/ecommerce/mobile/${slug}/`,data);
  }

}
