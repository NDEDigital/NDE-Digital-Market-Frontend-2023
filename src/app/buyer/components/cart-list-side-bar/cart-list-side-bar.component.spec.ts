import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartListSideBarComponent } from './cart-list-side-bar.component';

describe('CartListSideBarComponent', () => {
  let component: CartListSideBarComponent;
  let fixture: ComponentFixture<CartListSideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartListSideBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartListSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
