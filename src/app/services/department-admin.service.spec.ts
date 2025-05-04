import { TestBed } from '@angular/core/testing';

import { DepartmentAdminService } from './department-admin.service';

describe('DepartmentAdminService', () => {
  let service: DepartmentAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartmentAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
