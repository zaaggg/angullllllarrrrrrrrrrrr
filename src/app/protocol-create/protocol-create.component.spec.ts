import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocolCreateComponent } from './protocol-create.component';

describe('ProtocolCreateComponent', () => {
  let component: ProtocolCreateComponent;
  let fixture: ComponentFixture<ProtocolCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProtocolCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProtocolCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
