import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerAddBannerGridViewComponent } from './seller-add-banner-grid-view.component';

describe('SellerAddBannerGridViewComponent', () => {
  let component: SellerAddBannerGridViewComponent;
  let fixture: ComponentFixture<SellerAddBannerGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerAddBannerGridViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerAddBannerGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
