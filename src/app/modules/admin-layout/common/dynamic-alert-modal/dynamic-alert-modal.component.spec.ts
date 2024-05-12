import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicAlertModalComponent } from './dynamic-alert-modal.component';

describe('DynamicAlertModalComponent', () => {
  let component: DynamicAlertModalComponent;
  let fixture: ComponentFixture<DynamicAlertModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicAlertModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicAlertModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
