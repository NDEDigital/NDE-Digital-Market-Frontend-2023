import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitListGridViewComponent } from './unit-list-grid-view.component';

describe('UnitListGridViewComponent', () => {
  let component: UnitListGridViewComponent;
  let fixture: ComponentFixture<UnitListGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitListGridViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitListGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
