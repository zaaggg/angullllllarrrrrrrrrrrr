import { TestBed } from '@angular/core/testing';

import { PlantAdminService } from './plant-admin.service';

describe('PlantAdminService', () => {
  let service: PlantAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
