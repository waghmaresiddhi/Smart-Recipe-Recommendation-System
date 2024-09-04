/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CommonCrudService } from './common-crud.service';

describe('Service: CommonCrud', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonCrudService]
    });
  });

  it('should ...', inject([CommonCrudService], (service: CommonCrudService) => {
    expect(service).toBeTruthy();
  }));
});
