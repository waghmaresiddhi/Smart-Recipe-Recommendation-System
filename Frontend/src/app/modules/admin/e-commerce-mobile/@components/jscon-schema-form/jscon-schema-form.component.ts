import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';

@Component({
  selector: 'app-jscon-schema-form',
  template: `
  <div class="container mx-10 my-2">
   <form [formGroup]="form">
        <formly-form [model]="model" [fields]="fields" [options]="options" [form]="form">
        </formly-form>
    </form>
    <button mat-raised-button class="rounded-md" (click)="save()">Save</button>
  </div>
`,
  styles: [ 
  ]
})
export class JsconSchemaFormComponent implements OnInit {
  form: FormGroup;
  model: any;
  options: FormlyFormOptions;
  fields: FormlyFieldConfig[];

  constructor(
    private formlyJsonschema: FormlyJsonschema,

  ) { }
  jsonSchemaObj = {
    "schema": {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "type": "object",
      "properties": {
        "form_no": {
          "type": "string",
          "title": "Form No",

        },
        "father_qualification": {
          "type": "string",
          "title": "Father Qualification",
        },
        "father_occupation": {
          "type": "string",
          "title": "Father Occupation",
        },
        "annual_income": {
          "type": "string",
          "title":"Annual Income",
        },
        "mother_qualification": {
          "type": "string",
          "title":"Mother Qualification"
        },
        "mother_occupation": {
          "type": "string",
          "title":"Mother Occupation"
        },
        "nearest_land_mark": {
          "type": "string",
          "title":"Nearest Land Mark"
        },
        "email_id": {
          "type": "string",
          "title":"Email Id"
        },
        "specific_allergy": {
          "type": "string",
          "title":"Specific Allergy"
        },
        "specific_major_sickness_operation_in_past": {
          "type": "string",
          "title":"Major sickness in past"
        },
        "blood_group": {
          "type": "string",
          "title":"Blood Group"
        },
        "school_history": {
          "type": "array",
          "items": [
            {
              "type": "object",
              "properties": {
                "std": {
                  "type": "integer",
                  "title":"Standard",
                },
                "school_name": {
                  "type": "string",
                  "title":"School Name"
                }
              },
              "required": [
                "std",
                "school_name"
              ]
            },
          ]
        },
        "english_is_spoken_at_home": {
          "type": "boolean",
          "title":"English Spoken at home"
        },
        "school_bus_required": {
          "type": "boolean",
          "title":"School Bus Required"
        },
        "birth_certificate ": {
          "type": "boolean",
          "title":"Birth Certificate"
        },
        "transfer_certificate": {
          "type": "boolean",
          "title":"Transfer Certificate"
        },
        "leaving_certificate": {
          "type": "boolean",
          "title":"Leaving Certificate"
        },
        "progress_or_report_card": {
          "type": "boolean",
          "title":"Progress or report card"
        },
        "aadhar_card_xerox": {
          "type": "boolean",
          "title":"Addhar card xerox"
        },
        "passport_size_photograph": {
          "type": "boolean",
          "title":"Photograph"
        },
        "student_serial_id": {
          "type": "string",
          "title":"Student serial id"
        },
        "suggestions": {
          "type": "array",
          "title":"Suggestions",
          "items": [
            {
              "type": "object",
              "properties": {
                "suggestion": {
                  "type": "string",
                  "title":"Val"
                }
              },
              "required": [
                "suggestion"
              ]
            },
          ]
        },
        "place_of_declaration": {
          "type": "string",
          "title":"Place of Declaration"
        },
        "date_of_declaration": {
          "type": "string",
          "title":"Date of Declaration"
        },
        "name_of_parent_or_guardian": {
          "type": "string",
          "title":"Name of parent or guardian"
        },
        "sign_of_parent_or_guardian": {
          "type": "string",
          "title":"Sign of parent or guardian"
        },
        "admitted": {
          "type": "boolean",
          "title":"Admitted"
        },
        "not_admitted": {
          "type": "boolean",
          "title":"Not Admitted"
        },
        "register_number": {
          "type": "string",
          "title":"register_number"
        },
        "details_of_fees_or_deposit_paid": {
          "type": "string",
          "title":"Details of Fees"
        },
        "form_date": {
          "type": "string",
          "title":"Form Date"
        },
        "principal_sign": {
          "type": "string",
          "title":"Principal Sign"
        }
      },
      "required": [
        "form_no",
        "father_qualification",
        "father_occupation",
        "annual_income",
        "mother_qualification",
        "mother_occupation",
        "nearest_land_mark",
        "email_id",
        "specific_allergy",
        "specific_major_sickness_operation_in_past",
        "blood_group",
        "school_history",
        "english_is_spoken_at_home",
        "school_bus_required",
        "birth_certificate ",
        "transfer_certificate",
        "leaving_certificate",
        "progress_or_report_card",
        "aadhar_card_xerox",
        "passport_size_photograph",
        "student_serial_id",
        "suggestions",
        "place_of_declaration",
        "date_of_declaration",
        "name_of_parent_or_guardian",
        "sign_of_parent_or_guardian",
        "admitted",
        "not_admitted",
        "register_number",
        "details_of_fees_or_deposit_paid",
        "form_date",
        "principal_sign"
      ]
    },
    "model": {}
  }
  ngOnInit(): void {;
    this.form = new FormGroup({});
    this.options = {};
    this.fields = [this.formlyJsonschema.toFieldConfig(this.jsonSchemaObj.schema as any)];
    // this.model = this.jsonSchemaObj.model;

  }

  save(){
    console.log(this.form.value);
    
  }
}
