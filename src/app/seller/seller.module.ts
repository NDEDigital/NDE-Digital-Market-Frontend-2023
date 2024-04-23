import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SellerRoutingModule } from './seller-routing.module';
import { SellerComponent } from './seller.component';
import { AddPriceDiscountsComponent } from './components/add-price-discounts/add-price-discounts.component';
import { AddProductQuantityComponent } from './components/add-product-quantity/add-product-quantity.component';
import { SellerInventoryComponent } from './components/seller-inventory/seller-inventory.component';
import { SellerOrderComponent } from './components/seller-order/seller-order.component';
import { SellerOrdersComponent } from './components/seller-orders/seller-orders.component';
import { SellerPermissionComponent } from './components/seller-permission/seller-permission.component';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SellerRoutingModule,
    SharedModule,
  ],
  declarations: [
    SellerComponent,
    AddPriceDiscountsComponent,
    AddProductQuantityComponent,
    SellerInventoryComponent,
    SellerOrderComponent,
    SellerOrdersComponent,
    SellerPermissionComponent,
  ],
  exports: [
    AddPriceDiscountsComponent,
    AddProductQuantityComponent,
    SellerInventoryComponent,
    SellerOrderComponent,
    SellerOrdersComponent,
    SellerPermissionComponent,
  ],
})
export class SellerModule {}
