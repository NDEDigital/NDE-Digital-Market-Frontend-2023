import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusButtonsComponentComponent } from './status-buttons-component.component';

describe('StatusButtonsComponentComponent', () => {
  let component: StatusButtonsComponentComponent;
  let fixture: ComponentFixture<StatusButtonsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusButtonsComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusButtonsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
