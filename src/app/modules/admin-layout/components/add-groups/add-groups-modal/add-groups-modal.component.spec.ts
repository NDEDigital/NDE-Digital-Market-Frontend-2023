import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupsModalComponent } from './add-groups-modal.component';

describe('AddGroupsModalComponent', () => {
  let component: AddGroupsModalComponent;
  let fixture: ComponentFixture<AddGroupsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGroupsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGroupsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
