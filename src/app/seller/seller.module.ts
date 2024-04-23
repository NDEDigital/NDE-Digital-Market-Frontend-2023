import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SellerRoutingModule } from './seller-routing.module';
import { SellerComponent } from './seller.component';
import { AddPriceDiscountsComponent } from './add-price-discounts/add-price-discounts.component';
import { AddProductQuantityComponent } from './add-product-quantity/add-product-quantity.component';
import { SellerInventoryComponent } from './seller-inventory/seller-inventory.component';
import { SellerOrderComponent } from './seller-order/seller-order.component';
import { SellerOrdersComponent } from './seller-orders/seller-orders.component';
import { SellerPermissionComponent } from './seller-permission/seller-permission.component';
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
