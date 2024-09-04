import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ECommerceMobileComponent } from './e-commerce-mobile.component';
import { Route, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatButtonModule } from '@angular/material/button';

import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormlyMatToggleModule } from '@ngx-formly/material/toggle';
import { EcommerceFormComponent } from './@components/ecommerce-form/ecommerce-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FuseCardModule } from '@fuse/components/card';
import { GetSingleMobileResolver } from './@resolvers/get-single-mobile.resolver';
import { JsconSchemaFormComponent } from './@components/jscon-schema-form/jscon-schema-form.component';

const eCommerceRoutes: Route[] = [
  {
    path: '',
    component: ECommerceMobileComponent
  },
  {
    path: 'create',
    component: EcommerceFormComponent
  },
  {
    path: 'edit/:slug',
    component: EcommerceFormComponent,
    resolve:{apiData:GetSingleMobileResolver}
  },
  {
    path: 'jsonschema',
    component: JsconSchemaFormComponent
  },
  
  
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyModule.forChild(),
    FormlyMaterialModule,
    RouterModule.forChild(eCommerceRoutes),
    MatButtonModule,
    MatNativeDateModule,
    FormlyMatDatepickerModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    FormlyMatToggleModule,
    FuseCardModule
  ],
  declarations: [ECommerceMobileComponent, EcommerceFormComponent, JsconSchemaFormComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ECommerceMobileModule { }
