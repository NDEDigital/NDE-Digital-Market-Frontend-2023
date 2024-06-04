import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerApprovalImageViewModalComponent } from './banner-approval-image-view-modal.component';

describe('BannerApprovalImageViewModalComponent', () => {
  let component: BannerApprovalImageViewModalComponent;
  let fixture: ComponentFixture<BannerApprovalImageViewModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BannerApprovalImageViewModalComponent]
    });
    fixture = TestBed.createComponent(BannerApprovalImageViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
