import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCompareModalComponent } from './product-compare-modal.component';

describe('ProductCompareModalComponent', () => {
  let component: ProductCompareModalComponent;
  let fixture: ComponentFixture<ProductCompareModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCompareModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCompareModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
