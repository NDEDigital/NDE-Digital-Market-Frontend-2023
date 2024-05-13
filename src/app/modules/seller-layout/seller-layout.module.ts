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
