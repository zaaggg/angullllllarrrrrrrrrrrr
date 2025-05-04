import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantAdminComponent } from './plant-admin.component';

describe('PlantAdminComponent', () => {
  let component: PlantAdminComponent;
  let fixture: ComponentFixture<PlantAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
