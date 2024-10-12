import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
// import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
// import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { LabelSearchAddModule } from 'base-ui/label-search-add/label-search-add.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlySingleFilePickerComponent } from './shared/@components/formly-single-file-picker/formly-single-file-picker.component';
import { FormlySingleFilePickerValueAccessor } from './shared/@components/formly-single-file-picker/formly-single-file-picker-value-accessor';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormlySingleImagePickerComponent } from './shared/@components/formly-single-image-picker/formly-single-image-picker.component';
import { FormlySingleImagePickerValueAccessor } from './shared/@components/formly-single-image-picker/formly-single-image-picker-value-accessor';
import { IsSvgPipe } from './shared/@pipes/is-svg.pipe';
import { FormlyMultipleImagePickerComponent } from './shared/@components/formly-multiple-image-picker/formly-multiple-image-picker.component';
import { FormlyMultipleImagePickerValueAccessor } from './shared/@components/formly-multiple-image-picker/formly-multiple-image-picker-value-accessor';
import { UrlToFilenamePipe } from './shared/@pipes/url-to-filename.pipe';
import { FormlyMultipleFilePickerComponent } from './shared/@components/formly-multiple-file-picker/formly-multiple-file-picker.component';
import { FormlyMultipleFilePickerValueAccessor } from './shared/@components/formly-multiple-file-picker/formly-multiple-file-picker-value-accessor';
import { ArrayTypeComponent } from './shared/@components/single-components/array.type';
import { MultiSchemaTypeComponent } from './shared/@components/single-components/multischema.type';
import { NullTypeComponent } from './shared/@components/single-components/null.type';
import { ObjectTypeComponent } from './shared/@components/single-components/object.type';
import { ExpenseFormComponent } from './expenses/expense-form/expense-form.component';
import { DashboardComponent } from './expenses/dashboard/dashboard.component';

// Import PrimeNG modules
import { PanelModule } from 'primeng/panel'; // Keep PrimeNG modules
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card'; // Importing CardModule
import { TableModule } from 'primeng/table';
import { EditExpensesComponent } from './expenses/edit-expenses/edit-expenses.component';
import { ViewReportsComponent } from './expenses/view-reports/view-reports.component';
import { ShowChartComponent } from './expenses/show-chart/show-chart.component';
import { HelpCenterComponent } from './expenses/help-center/help-center.component';
import { SettingsComponent } from './expenses/settings/settings.component'; // Importing TableModule

const routerConfig: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent,

        FormlySingleFilePickerComponent,
        FormlySingleFilePickerValueAccessor,

        FormlySingleImagePickerComponent,
        FormlySingleImagePickerValueAccessor,

        FormlyMultipleImagePickerComponent,
        FormlyMultipleImagePickerValueAccessor,

        FormlyMultipleFilePickerComponent,
        FormlyMultipleFilePickerValueAccessor,

        NullTypeComponent,
        ArrayTypeComponent,
        ObjectTypeComponent,
        MultiSchemaTypeComponent,
        
        IsSvgPipe,
        UrlToFilenamePipe,
        ExpenseFormComponent,
        DashboardComponent,
        EditExpensesComponent,
        ViewReportsComponent,
        ShowChartComponent,
        HelpCenterComponent,
        SettingsComponent,
        
    ],
    imports: [
        BrowserModule,
        MatButtonModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        // FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,

        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),
        SocialLoginModule,
        LabelSearchAddModule,
        ReactiveFormsModule,
        FormsModule,
        FormlyModule.forRoot({
            extras: { lazyRender: true },
            types: [
                { name: 'app-formly-single-file-picker', component: FormlySingleFilePickerComponent },
                { name: 'app-formly-single-image-picker', component: FormlySingleImagePickerComponent },
                { name: 'app-formly-multiple-image-picker', component: FormlyMultipleImagePickerComponent },
                { name: 'app-formly-multiple-file-picker', component: FormlyMultipleFilePickerComponent },
                { name: 'string', extends: 'input' },
                {
                  name: 'number',
                  extends: 'input',
                  defaultOptions: {
                    templateOptions: {
                      type: 'number',
                    },
                  },
                },
                {
                  name: 'integer',
                  extends: 'input',
                  defaultOptions: {
                    templateOptions: {
                      type: 'number',
                    },
                  },
                },
                { name: 'boolean', extends: 'checkbox' },
                { name: 'enum', extends: 'select' },
                { name: 'null', component: NullTypeComponent, wrappers: ['form-field'] },
                { name: 'array', component: ArrayTypeComponent },
                { name: 'object', component: ObjectTypeComponent },
                { name: 'multischema', component: MultiSchemaTypeComponent },
            ]
        }),
        FormlyMaterialModule,
        MatIconModule,
        
        // PrimeNG modules added
        PanelModule,
        ButtonModule,
        ChartModule,
        DropdownModule,
        CardModule, // Adding CardModule to imports
        TableModule, // Adding TableModule to imports
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider(
                            '667211677357-89cvrbt048k04vc0g7pm0c1bpcl6srep.apps.googleusercontent.com'
                        )
                    },
                    {
                        id: FacebookLoginProvider.PROVIDER_ID,
                        provider: new FacebookLoginProvider('820327078896132')
                    }
                ]
            } as SocialAuthServiceConfig,
        },
    ]
})
export class AppModule {}
