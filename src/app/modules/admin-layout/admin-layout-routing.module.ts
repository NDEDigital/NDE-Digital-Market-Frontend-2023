import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';
import { AddGroupsComponent } from './components/add-groups/add-groups.component';
import { AddProductsComponent } from './components/add-products/add-products.component';
import { SellerListComponent } from './components/seller-list/seller-list.component';
import { AdminOrderComponent } from './components/admin-order/admin-order.component';
import { BannerApprovalComponent } from './components/banner-approval/banner-approval.component';
import { BrandsComponent } from './components/brands/brands.component';
import { CompanyApprovalComponent } from './components/company-approval/company-approval.component';
import { ProductApprovalComponent } from './components/product-approval/product-approval.component';
import { UnitListComponent } from './components/unit-list/unit-list.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'product-groups', component: AddGroupsComponent },
      { path: 'products', component: AddProductsComponent },
      { path: 'user-list', component: SellerListComponent },
      { path: 'admin-order', component: AdminOrderComponent },
      { path: 'banner-approval', component: BannerApprovalComponent },
      { path: 'brands', component: BrandsComponent },
      { path: 'company-approval', component: CompanyApprovalComponent },
      { path: 'product-approval', component: ProductApprovalComponent },
      { path: 'unit-list', component: UnitListComponent },
      { path: '', redirectTo: 'products', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminLayoutRoutingModule {}
