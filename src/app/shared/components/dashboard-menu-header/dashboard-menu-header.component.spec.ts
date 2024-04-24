import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMenuHeaderComponent } from './dashboard-menu-header.component';

describe('DashboardMenuHeaderComponent', () => {
  let component: DashboardMenuHeaderComponent;
  let fixture: ComponentFixture<DashboardMenuHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardMenuHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardMenuHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
