import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillReportComponent } from './fill-report.component';

describe('FillReportComponent', () => {
  let component: FillReportComponent;
  let fixture: ComponentFixture<FillReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FillReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FillReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
