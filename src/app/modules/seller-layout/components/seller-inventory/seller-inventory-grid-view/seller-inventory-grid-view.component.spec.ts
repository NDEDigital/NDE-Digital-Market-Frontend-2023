import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerInventoryGridViewComponent } from './seller-inventory-grid-view.component';

describe('SellerInventoryGridViewComponent', () => {
  let component: SellerInventoryGridViewComponent;
  let fixture: ComponentFixture<SellerInventoryGridViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SellerInventoryGridViewComponent]
    });
    fixture = TestBed.createComponent(SellerInventoryGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
