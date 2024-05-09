import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellerLayoutComponent } from './seller-layout.component';
import { SellerInventoryComponent } from './components/seller-inventory/seller-inventory.component';
import { AddProductQuantityComponent } from './components/add-product-quantity/add-product-quantity.component';
import { SellerOrdersComponent } from './components/seller-orders/seller-orders.component';
import { AddPriceDiscountsComponent } from './components/add-price-discounts/add-price-discounts.component';
import { SellerListComponent } from '../admin-layout/components/seller-list/seller-list.component';
import { SellerPermissionComponent } from './components/seller-permission/seller-permission.component';
import { SellerAddBannerComponent } from './components/seller-add-banner/seller-add-banner.component';

const routes: Routes = [
  {
    path: '',
    component: SellerLayoutComponent,
    children: [
      { path: 'inventory', component: SellerInventoryComponent },
      { path: 'add-quantity', component: AddProductQuantityComponent },
      // { path: 'user-list', component: SellerListComponent },
      { path: 'seller-order', component: SellerOrdersComponent },
      { path: 'product-price&discount', component: AddPriceDiscountsComponent },
      { path: 'seller-list', component: SellerListComponent },
      { path: 'seller-permission', component: SellerPermissionComponent },
      { path: 'add-banner', component: SellerAddBannerComponent },
      { path: '', redirectTo: 'inventory', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellerLayoutRoutingModule {}
