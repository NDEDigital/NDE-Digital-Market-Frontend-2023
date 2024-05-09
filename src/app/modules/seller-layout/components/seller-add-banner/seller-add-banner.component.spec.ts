import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerAddBannerComponent } from './seller-add-banner.component';

describe('SellerAddBannerComponent', () => {
  let component: SellerAddBannerComponent;
  let fixture: ComponentFixture<SellerAddBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerAddBannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerAddBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
