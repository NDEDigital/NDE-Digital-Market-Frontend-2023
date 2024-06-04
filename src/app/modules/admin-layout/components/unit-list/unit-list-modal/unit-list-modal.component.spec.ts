import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitListModalComponent } from './unit-list-modal.component';

describe('UnitListModalComponent', () => {
  let component: UnitListModalComponent;
  let fixture: ComponentFixture<UnitListModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnitListModalComponent]
    });
    fixture = TestBed.createComponent(UnitListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
