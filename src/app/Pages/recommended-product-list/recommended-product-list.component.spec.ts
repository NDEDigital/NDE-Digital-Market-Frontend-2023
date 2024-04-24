import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedProductListComponent } from './recommended-product-list.component';

describe('RecommendedProductListComponent', () => {
  let component: RecommendedProductListComponent;
  let fixture: ComponentFixture<RecommendedProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendedProductListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendedProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
