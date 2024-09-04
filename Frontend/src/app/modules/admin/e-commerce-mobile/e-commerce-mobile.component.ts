import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { formDataToMultiPart } from 'app/core/constants.utils';
import { environment } from 'environments/environment';
import { of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ECommerceService } from './@service/e-commerce.service';

export interface Mobile_image {
  id: number;
  mobile: number;
  image_storage: number;
}

export interface EcommerceMobile {
  id: number;
  name: string;
  slug: string;
  tags: number[];
  display_price: number;
  buy_price: number;
  discount: number;
  screen_type: number;
  ram: number;
  ram_unit: number;
  processor: string;
  color: number[];
  brand: number;
  front_camera: number;
  back_camera: number;
  usb_port: number;
  has_earphone_jack: boolean;
  description: string;
  launch_date: string | any;
  spec: string;
  mobile_image: Mobile_image[];
}

export interface EcommerceMobileApi {
  count: number;
  next: string;
  previous: string;
  results: EcommerceMobile[];
}

@Component({
  selector: 'app-e-commerce-mobile',
  templateUrl: './e-commerce-mobile.component.html',
  styleUrls: ['./e-commerce-mobile.component.scss'],
  providers:[DatePipe]
})
export class ECommerceMobileComponent implements OnInit {

  constructor(
    private _eCommerceService:ECommerceService,
  ) { }

  ngOnInit() {
  }

  label: string = 'List';

  searchPlaceholder: string = `Search ${this.label}`;

  buttonLabel: string = 'Add';

  showButton: boolean = true;

  myRouterLink: string = '';

  searchChange = new EventEmitter();

  addButtonClick = new EventEmitter();

  onSearchChange(search: string) {
    this.searchChange.emit(search);
  }

  onAddClick(click: any) {
    this.addButtonClick.emit(click);
  }

  list$ = this._eCommerceService.getList();

}


