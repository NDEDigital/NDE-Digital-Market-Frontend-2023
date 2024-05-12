import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminLayoutRoutingModule } from './admin-layout-routing.module';
import { AdminLayoutComponent } from './admin-layout.component';
import { UnitListComponent } from './components/unit-list/unit-list.component';
import { AddGroupsComponent } from './components/add-groups/add-groups.component';
import { AddProductComponent } from 'src/app/Pages/add-product/add-product.component';
import { BannerApprovalComponent } from './components/banner-approval/banner-approval.component';
import { CompanyApprovalComponent } from './components/company-approval/company-approval.component';
import { ProductApprovalComponent } from './components/product-approval/product-approval.component';
import { AdminOrderComponent } from './components/admin-order/admin-order.component';
import { BrandsComponent } from './components/brands/brands.component';
import { SellerListComponent } from './components/seller-list/seller-list.component';
import { AdminHeaderComponent } from './common/admin-header/admin-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductGroupModalComponent } from './components/add-groups/product-group-modal/product-group-modal.component';
import { GridViewComponent } from './components/add-groups/grid-view/grid-view.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
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
    ProductGroupModalComponent,
    GridViewComponent,
  ],
  imports: [
    CommonModule,
    AdminLayoutRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class AdminLayoutModule {}
