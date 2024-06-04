import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPriceDiscountsGridViewComponent } from './add-price-discounts-grid-view.component';

describe('AddPriceDiscountsGridViewComponent', () => {
  let component: AddPriceDiscountsGridViewComponent;
  let fixture: ComponentFixture<AddPriceDiscountsGridViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPriceDiscountsGridViewComponent]
    });
    fixture = TestBed.createComponent(AddPriceDiscountsGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
