import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerLayoutRoutingModule } from './seller-layout-routing.module';
import { SellerLayoutComponent } from './seller-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddPriceDiscountsComponent } from './components/add-price-discounts/add-price-discounts.component';
import { AddProductQuantityComponent } from './components/add-product-quantity/add-product-quantity.component';
import { SellerInventoryComponent } from './components/seller-inventory/seller-inventory.component';
import { SellerOrderComponent } from './components/seller-order/seller-order.component';
import { SellerOrdersComponent } from './components/seller-orders/seller-orders.component';
import { SellerPermissionComponent } from './components/seller-permission/seller-permission.component';
import { SellerAddBannerComponent } from './components/seller-add-banner/seller-add-banner.component';
import { SellerHeaderComponent } from './common/seller-header/seller-header.component';
import { AdminLayoutModule } from '../admin-layout/admin-layout.module';
import { SellerAddBannerGridViewComponent } from './components/seller-add-banner/seller-add-banner-grid-view/seller-add-banner-grid-view.component';
import { AddPriceDiscountsGridViewComponent } from './components/add-price-discounts/add-price-discounts-grid-view/add-price-discounts-grid-view.component';
import { DynamicAlertModalComponent } from './common/dynamic-alert-modal/dynamic-alert-modal.component';
import { SellerInventoryGridViewComponent } from './components/seller-inventory/seller-inventory-grid-view/seller-inventory-grid-view.component';
import { SellerInventorySearchComponent } from './components/seller-inventory/seller-inventory-search/seller-inventory-search.component';

@NgModule({
  declarations: [
    SellerLayoutComponent,
    AddPriceDiscountsComponent,
    AddProductQuantityComponent,
    SellerInventoryComponent,
    SellerOrderComponent,
    SellerOrdersComponent,
    SellerPermissionComponent,
    SellerAddBannerComponent,
    SellerHeaderComponent,
    SellerAddBannerGridViewComponent,
    AddPriceDiscountsGridViewComponent,
    DynamicAlertModalComponent,
    SellerInventoryGridViewComponent,
    SellerInventorySearchComponent,
  ],
  imports: [
    CommonModule,
    SellerLayoutRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AdminLayoutModule,
  ],
})
export class SellerLayoutModule {}
