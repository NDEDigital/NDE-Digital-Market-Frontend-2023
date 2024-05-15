import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerApprovalGridViewComponent } from './banner-approval-grid-view.component';

describe('BannerApprovalGridViewComponent', () => {
  let component: BannerApprovalGridViewComponent;
  let fixture: ComponentFixture<BannerApprovalGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannerApprovalGridViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerApprovalGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
