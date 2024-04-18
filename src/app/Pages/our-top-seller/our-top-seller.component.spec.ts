import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurTopSellerComponent } from './our-top-seller.component';

describe('OurTopSellerComponent', () => {
  let component: OurTopSellerComponent;
  let fixture: ComponentFixture<OurTopSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OurTopSellerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurTopSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
