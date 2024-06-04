import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerApprovalRoutingModule } from './banner-approval-routing.module';
import { BannerApprovalGridViewComponent } from './banner-approval-grid-view/banner-approval-grid-view.component';
import { BannerApprovalImageViewModalComponent } from './banner-approval-image-view-modal/banner-approval-image-view-modal.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, BannerApprovalRoutingModule],
})
export class BannerApprovalModule {}
