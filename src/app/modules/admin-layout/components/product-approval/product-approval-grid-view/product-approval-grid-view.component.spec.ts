import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductApprovalGridViewComponent } from './product-approval-grid-view.component';

describe('ProductApprovalGridViewComponent', () => {
  let component: ProductApprovalGridViewComponent;
  let fixture: ComponentFixture<ProductApprovalGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductApprovalGridViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductApprovalGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
