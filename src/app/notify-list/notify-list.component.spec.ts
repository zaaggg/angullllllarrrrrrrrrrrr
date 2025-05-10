import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifyListComponent } from './notify-list.component';

describe('NotifyListComponent', () => {
  let component: NotifyListComponent;
  let fixture: ComponentFixture<NotifyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotifyListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotifyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
