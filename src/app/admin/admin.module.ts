import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module'; // Admin-specific routing

// Admin components
import { UnitListComponent } from './components/unit-list/unit-list.component';
import { AddGroupsComponent } from './components/add-groups/add-groups.component';
import { AddProductComponent } from '../Pages/add-product/add-product.component';
import { BannerApprovalComponent } from './components/banner-approval/banner-approval.component';
import { CompanyApprovalComponent } from './components/company-approval/company-approval.component';
import { ProductApprovalComponent } from './components/product-approval/product-approval.component';
import { AdminOrderComponent } from './components/admin-order/admin-order.component';
import { SharedModule } from '../shared/shared.module';
import { BrandsComponent } from './components/brands/brands.component';
import { AdminComponent } from './admin.component';
import { SellerListComponent } from './components/seller-list/seller-list.component';
import { AdminHeaderComponent } from './common/admin-header/admin-header.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    SharedModule,
  ],
  declarations: [
    AdminComponent,
    UnitListComponent,
    AddGroupsComponent,
    AddProductComponent,
    BannerApprovalComponent,
    CompanyApprovalComponent,
    ProductApprovalComponent,
    AdminOrderComponent,
    BrandsComponent,
    SellerListComponent,
    AdminHeaderComponent,
  ],
  exports: [
    SellerListComponent,
    UnitListComponent,
    AddGroupsComponent,
    AddProductComponent,
    BannerApprovalComponent,
    CompanyApprovalComponent,
    ProductApprovalComponent,
    AdminOrderComponent,
    BrandsComponent,
  ],
})
export class AdminModule {}
