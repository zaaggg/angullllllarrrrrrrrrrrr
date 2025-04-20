import { TestBed } from '@angular/core/testing';

import { ReportEntryService } from './report-entry.service';

describe('ReportEntryService', () => {
  let service: ReportEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
