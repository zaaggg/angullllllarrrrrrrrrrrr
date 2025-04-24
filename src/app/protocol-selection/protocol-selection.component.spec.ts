import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocolSelectionComponent } from './protocol-selection.component';

describe('ProtocolSelectionComponent', () => {
  let component: ProtocolSelectionComponent;
  let fixture: ComponentFixture<ProtocolSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProtocolSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProtocolSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
