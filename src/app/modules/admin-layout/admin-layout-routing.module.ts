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
import { SellerAddBannerComponent } from '../seller-layout/components/seller-add-banner/seller-add-banner.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'product-groups', component: AddGroupsComponent },
      {
        path: 'products',
        loadChildren: () =>
          import('./components/add-products/add-products-routing.module').then(
            (m) => m.AddProductsRoutingModule
          ),
      },

      // { path: 'user-list', component: SellerListComponent },
      {
        path: 'user-list',
        loadChildren: () =>
          import('./components/seller-list/seller-list-routing.module').then(
            (m) => m.SellerListRoutingModule
          ),
      },
      // { path: 'admin-order', component: AdminOrderComponent },
      {
        path: 'admin-order',
        loadChildren: () =>
          import('./components/admin-order/admin-order-routing.module').then(
            (m) => m.AdminOrderRoutingModule
          ),
      },

      // { path: 'banner-approval', component: BannerApprovalComponent },
      {
        path: 'banner-approval',
        loadChildren: () =>
          import(
            './components/banner-approval/banner-approval-routing.module'
          ).then((m) => m.BannerApprovalRoutingModule),
      },

      // { path: 'brands', component: BrandsComponent },
      {
        path: 'brands',
        loadChildren: () =>
          import('./components/brands/brands-routing.module').then(
            (m) => m.BrandsRoutingModule
          ),
      },

      // { path: 'company-approval', component: CompanyApprovalComponent },
      {
        path: 'company-approval',
        loadChildren: () =>
          import(
            './components/company-approval/company-approval-routing.module'
          ).then((m) => m.CompanyApprovalRoutingModule),
      },

      // { path: 'product-approval', component: ProductApprovalComponent },
      {
        path: 'product-approval',
        loadChildren: () =>
          import(
            './components/product-approval/product-approval-routing.module'
          ).then((m) => m.ProductApprovalRoutingModule),
      },

      // { path: 'unit-list', component: UnitListComponent },

      {
        path: 'unit-list',
        loadChildren: () =>
          import('./components/unit-list/unit-list-routing.module').then(
            (m) => m.UnitListRoutingModule
          ),
      },

      { path: 'add-banner', component: SellerAddBannerComponent },
      // {
      //   path: 'add-banner',
      //   loadChildren: () =>
      //     import('./components/unit-list/unit-list-routing.module').then(
      //       (m) => m.UnitListRoutingModule
      //     ),
      // },

      { path: '', redirectTo: 'products', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminLayoutRoutingModule {}
