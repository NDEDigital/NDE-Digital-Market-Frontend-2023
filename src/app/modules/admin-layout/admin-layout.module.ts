import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutRoutingModule } from './admin-layout-routing.module';
import { AdminLayoutComponent } from './admin-layout.component';
import { UnitListComponent } from './components/unit-list/unit-list.component';
import { AddGroupsComponent } from './components/add-groups/add-groups.component';
import { AddProductsComponent } from './components/add-products/add-products.component';
import { BannerApprovalComponent } from './components/banner-approval/banner-approval.component';
import { CompanyApprovalComponent } from './components/company-approval/company-approval.component';
import { ProductApprovalComponent } from './components/product-approval/product-approval.component';
import { AdminOrderComponent } from './components/admin-order/admin-order.component';
import { BrandsComponent } from './components/brands/brands.component';
import { SellerListComponent } from './components/seller-list/seller-list.component';
import { AdminHeaderComponent } from './common/admin-header/admin-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { GridViewComponent } from './components/add-groups/grid-view/grid-view.component';
import { AddGroupsModalComponent } from './components/add-groups/add-groups-modal/add-groups-modal.component';
import { DynamicAlertModalComponent } from './common/dynamic-alert-modal/dynamic-alert-modal.component';
import { AddProductComponent } from 'src/app/Pages/add-product/add-product.component';
import { StatusButtonComponent } from './common/status-button/status-button.component';
import { ProductGridViewComponent } from './components/add-products/product-grid-view/product-grid-view.component';
import { CompanyApprovalGridViewComponent } from './components/company-approval/company-approval-grid-view/company-approval-grid-view.component';
import { BannerApprovalGridViewComponent } from './components/banner-approval/banner-approval-grid-view/banner-approval-grid-view.component';
import { AddProductsModalComponent } from './components/add-products/add-products-modal/add-products-modal.component';
import { ProductApprovalGridViewComponent } from './components/product-approval/product-approval-grid-view/product-approval-grid-view.component';
import { ProductCompareModalComponent } from './components/product-approval/product-compare-modal/product-compare-modal.component';
import { UnitListGridViewComponent } from './components/unit-list/unit-list-grid-view/unit-list-grid-view.component';
import { BrandsGridViewComponent } from './components/brands/brands-grid-view/brands-grid-view.component';
import { SellerListGridViewComponent } from './components/seller-list/seller-list-grid-view/seller-list-grid-view.component';
import { CompanyTradeLicenceModalComponent } from './components/company-approval/company-trade-licence-modal/company-trade-licence-modal.component';
import { BrandsModalComponent } from './components/brands/brands-modal/brands-modal.component';
@NgModule({
  declarations: [
    AdminLayoutComponent,
    UnitListComponent,
    AddGroupsComponent,
    AddProductsComponent,
    BannerApprovalComponent,
    CompanyApprovalComponent,
    ProductApprovalComponent,
    AdminOrderComponent,
    BrandsComponent,
    SellerListComponent,
    AdminHeaderComponent,
    GridViewComponent,
    AddGroupsModalComponent,
    DynamicAlertModalComponent,
    AddProductComponent,
    StatusButtonComponent,
    ProductGridViewComponent,
    CompanyApprovalGridViewComponent,
    BannerApprovalGridViewComponent,
    AddProductsModalComponent,
    ProductApprovalGridViewComponent,
    ProductCompareModalComponent,
    UnitListGridViewComponent,
    BrandsGridViewComponent,
    SellerListGridViewComponent,
    CompanyTradeLicenceModalComponent,
    BrandsModalComponent,
  ],
  exports: [StatusButtonComponent],
  imports: [
    CommonModule,
    AdminLayoutRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminLayoutModule {}
