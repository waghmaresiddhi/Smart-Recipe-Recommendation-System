import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ECommerceService } from '../@service/e-commerce.service';

@Injectable({
  providedIn: 'root'
})
export class GetSingleMobileResolver implements Resolve<any> {
  constructor(private _eCommerceService:ECommerceService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

    return this._eCommerceService.getSingleMobile(route.params['slug']);
  }
}
