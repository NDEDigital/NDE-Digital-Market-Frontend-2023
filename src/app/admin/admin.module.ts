import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module'; // Admin-specific routing

// Admin components
import { UnitListComponent } from '../modules/admin-layout/components/unit-list/unit-list.component';
import { AddGroupsComponent } from '../modules/admin-layout/components/add-groups/add-groups.component';
import { AddProductComponent } from '../Pages/add-product/add-product.component';
import { BannerApprovalComponent } from '../modules/admin-layout/components/banner-approval/banner-approval.component';
import { CompanyApprovalComponent } from '../modules/admin-layout/components/company-approval/company-approval.component';
import { ProductApprovalComponent } from '../modules/admin-layout/components/product-approval/product-approval.component';
import { AdminOrderComponent } from '../modules/admin-layout/components/admin-order/admin-order.component';
import { SharedModule } from '../shared/shared.module';
import { BrandsComponent } from '../modules/admin-layout/components/brands/brands.component';
import { AdminComponent } from './admin.component';
import { SellerListComponent } from '../modules/admin-layout/components/seller-list/seller-list.component';
import { AdminHeaderComponent } from '../modules/admin-layout/common/admin-header/admin-header.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    SharedModule,
  ],
  declarations: [AdminComponent],
  exports: [],
})
export class AdminModule {}
