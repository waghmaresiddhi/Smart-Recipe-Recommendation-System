import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { formDataToMultiPart } from 'app/core/constants.utils';
import { environment } from 'environments/environment';
import { of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ECommerceService } from '../../@service/e-commerce.service';

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
  selector: 'app-ecommerce-form',
  templateUrl: './ecommerce-form.component.html',
  styleUrls: ['./ecommerce-form.component.scss'],
  providers: [DatePipe]
})
export class EcommerceFormComponent implements OnInit {

  constructor(
    private _httpClient: HttpClient,
    private _eCommerceService: ECommerceService,
    private _datePipe: DatePipe,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    ) { }

  ngOnInit() {
  }

  apiData$ = this._activatedRoute.data.pipe(
    map(data => {
      if (data.apiData) {
        console.log();
        let apiData = data.apiData;
        let patchData = {
          ...apiData,
          screen_type: apiData.screen_type.id,
          ram_unit: apiData.ram_unit.id,
          brand: apiData.brand.id,
          color: apiData.color.map(obj => obj.id),
          tags: apiData.tags.map(obj => obj.id),
          usb_port: apiData.usb_port.id,
          spec: { src: apiData.spec, file: null },
          featured_image: { src: apiData.featured_image, file: null },
          mobile_image: apiData.mobile_image.map(obj => {
            return {
              id:obj.image_storage.id,
              url:obj.image_storage.image
            }
          }),
        }
        this.form.patchValue(patchData);
        return apiData;
      }
      return null;
    })
  )

  form = new FormGroup({});

  model: EcommerceMobile = {
    name: 'Sample',
    tags: [1, 2],
    display_price: 20,
    buy_price: 20,
    discount: 20,
    screen_type: 1,
    ram: 20,
    ram_unit: 1,
    processor: 'Intel Core',
    color: [1, 2],
    brand: 1,
    front_camera: 20,
    back_camera: 20,
    usb_port: 1,
    has_earphone_jack: true,
    description: 'Description',
    launch_date: new Date(),
    mobile_image: [],
    spec: null,
    id: 0,
    slug: ''
  };
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      "fieldGroupClassName": "grid grid-cols-1 sm:grid-cols-4 gap-4",
      "fieldGroup": [
        {
          key: 'slug',
          type: 'input',
          className: "hidden",
          templateOptions: {
            label: 'Slug',
          },
        },
        {
          key:"featured_image",
          type:'app-formly-single-image-picker',
          className:"sm:col-span-4 col-span-4"
        },
        {
          key:"mobile_image",
          type:'app-formly-multiple-file-picker',
          className:"sm:col-span-4 col-span-4",
          options:{
            formState:{
              apiUrl:'/ecommerce/image_storage/',
              filePrefix:'file_',
            },
          },
          templateOptions:{
            apiUrl:'/ecommerce/image_storage/',
            filePrefix:'file_',
          }

        },
        {
          key: 'name',
          type: 'input',
          className: "sm:col-span-2 col-span-4",
          templateOptions: {
            label: 'Name',
            required: true
          },
        },
        
        {
          key: 'processor',
          type: 'input',
          className: "sm:col-span-2 col-span-4",
          templateOptions: {
            label: 'Processor',
          },
        },
        {
          key: 'display_price',
          type: 'input',
          className: "sm:col-span-2 col-span-4",
          templateOptions: {
            type: 'number',
            label: 'Display Price',
          },
        },
        {
          key: 'buy_price',
          type: 'input',
          className: "sm:col-span-2 col-span-4",
          templateOptions: {
            type: 'number',
            label: 'Buy Price',
          },
        },

        {
          key: 'ram',
          type: 'input',
          className: "sm:col-span-2 col-span-4",
          templateOptions: {
            type: 'number',
            label: 'Ram',
          },
        },
        {
          key: 'ram_unit',
          type: 'select',
          className: "sm:col-span-2 col-span-4",
          templateOptions: {
            label: 'Ram Unit',
            options: this._eCommerceService.getRamUnit()
          },
        },
        {
          key: 'discount',
          type: 'input',
          className: "sm:col-span-2 col-span-4",
          templateOptions: {
            type: 'number',
            label: 'Discount',
          },
        },
        {
          key: 'screen_type',
          type: 'radio',
          className: "sm:col-span-2 col-span-4",
          templateOptions: {
            label: 'Screen Type',
            options: this._eCommerceService.getScreenType()
          },
        },
        {
          key: 'brand',
          type: 'select',
          className: "sm:col-span-2 col-span-4",
          templateOptions: {
            label: 'Brand',
            options: this._eCommerceService.getBrand()
          },
        },
        {
          key: 'color',
          type: 'select',
          className: "sm:col-span-2 col-span-4",
          templateOptions: {
            label: 'Color',
            multiple: true,
            options: this._eCommerceService.getColor()
          },
        },
        {
          key: 'tags',
          type: 'select',
          className: "sm:col-span-2 col-span-4",
          templateOptions: {
            label: 'Tags',
            multiple: true,
            options: this._eCommerceService.getTags()
          },
        },
        {
          key: 'usb_port',
          type: 'select',
          className: "sm:col-span-2 col-span-4",
          templateOptions: {
            label: 'Usb Port',
            options: this._eCommerceService.getUsbPort()
          },
        },
        {
          key: 'front_camera',
          type: 'input',
          className: "sm:col-span-2 col-span-4",
          templateOptions: {
            type: 'number',
            label: 'Front Camera',
          },
        },
        {
          key: 'back_camera',
          type: 'input',
          className: "sm:col-span-2 col-span-4",
          templateOptions: {
            type: 'number',
            label: 'Back Camera',
          },
        },
        {
          key: 'launch_date',
          type: 'datepicker',
          className: "sm:col-span-2 col-span-4",
          templateOptions: {
            label: 'Launch Date',
          },
        },
        {
          key: 'has_earphone_jack',
          type: 'toggle',
          className: "sm:col-span-2 col-span-4 mt-6",
          templateOptions: {
            label: 'Earphone Jack',
          },
        },
        {
          key: 'description',
          type: 'textarea',
          className: "col-span-4",
          templateOptions: {
            label: 'Description',
            rows: 10,
          },
        },
      ]
    },
    {
      "fieldGroupClassName": "grid grid-cols-1 sm:grid-cols-4 gap-4",
      "fieldGroup": [
        {
          key: 'spec',
          type: 'app-formly-single-file-picker',
          className: "sm:col-span-2 col-span-4"
        },
      ],
    },
  ];



  onReset() {
    this.form.reset();
  }

  onSave() {
    let data = this.form.value;
    console.log(data.mobile_image);
    
    data = {
      ...data,
      launch_date: this._datePipe.transform(data.launch_date, 'YYYY-MM-dd'),
      mobile_image:data.mobile_image.map(obj => {
        return {image_storage:obj.id}
      } )
    }
    console.log(data.mobile_image);
    
    let formData = formDataToMultiPart(data);
    if (this.form.get('slug').value) {
      this._eCommerceService.updateMobile(data.slug, formData).subscribe(next => {
        console.log(next);
        this._router.navigateByUrl('/e-commerce');
      });
    } else {
      this._eCommerceService.saveMobile(formData).subscribe(next => {
        this._router.navigateByUrl('/e-commerce');
        console.log(next);
      });
    }
  }

}
