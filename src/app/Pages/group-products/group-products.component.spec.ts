import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupProductsComponent } from './group-products.component';

describe('GroupProductsComponent', () => {
  let component: GroupProductsComponent;
  let fixture: ComponentFixture<GroupProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
