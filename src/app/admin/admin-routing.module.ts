import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import the admin components
import { UnitListComponent } from '../modules/admin-layout/components/unit-list/unit-list.component';
import { AddGroupsComponent } from '../modules/admin-layout/components/add-groups/add-groups.component';
import { AddProductsComponent } from '../modules/admin-layout/components/add-products/add-products.component';
import { CompanyApprovalComponent } from '../modules/admin-layout/components/company-approval/company-approval.component';
import { ProductApprovalComponent } from '../modules/admin-layout/components/product-approval/product-approval.component';
import { AdminOrderComponent } from '../modules/admin-layout/components/admin-order/admin-order.component';
import { AdminComponent } from './admin.component';
import { BannerApprovalComponent } from '../modules/admin-layout/components/banner-approval/banner-approval.component';
import { BrandsComponent } from '../modules/admin-layout/components/brands/brands.component';
import { SellerListComponent } from '../modules/admin-layout/components/seller-list/seller-list.component';
// Define the routes for the admin module
const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
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

// Configure the routing module
@NgModule({
  imports: [RouterModule.forChild(routes)], // Use forChild to import child routes
  exports: [RouterModule], // Export RouterModule to make it available to other modules
})
export class AdminRoutingModule {}
