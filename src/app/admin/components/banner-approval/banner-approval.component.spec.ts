import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerApprovalComponent } from './banner-approval.component';

describe('BannerApprovalComponent', () => {
  let component: BannerApprovalComponent;
  let fixture: ComponentFixture<BannerApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannerApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
