import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerInventorySearchComponent } from './seller-inventory-search.component';

describe('SellerInventorySearchComponent', () => {
  let component: SellerInventorySearchComponent;
  let fixture: ComponentFixture<SellerInventorySearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SellerInventorySearchComponent]
    });
    fixture = TestBed.createComponent(SellerInventorySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
