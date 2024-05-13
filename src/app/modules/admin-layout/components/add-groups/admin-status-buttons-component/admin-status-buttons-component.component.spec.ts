import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStatusButtonsComponentComponent } from './admin-status-buttons-component.component';

describe('AdminStatusButtonsComponentComponent', () => {
  let component: AdminStatusButtonsComponentComponent;
  let fixture: ComponentFixture<AdminStatusButtonsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminStatusButtonsComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminStatusButtonsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
