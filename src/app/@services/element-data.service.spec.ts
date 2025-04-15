import { TestBed } from '@angular/core/testing';

import { ELEMENTDATAService } from '../element-data.service';

describe('ELEMENTDATAService', () => {
  let service: ELEMENTDATAService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ELEMENTDATAService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
