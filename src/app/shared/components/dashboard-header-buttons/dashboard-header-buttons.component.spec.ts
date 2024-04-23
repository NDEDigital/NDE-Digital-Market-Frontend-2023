import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHeaderButtonsComponent } from './dashboard-header-buttons.component';

describe('DashboardHeaderButtonsComponent', () => {
  let component: DashboardHeaderButtonsComponent;
  let fixture: ComponentFixture<DashboardHeaderButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardHeaderButtonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardHeaderButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
