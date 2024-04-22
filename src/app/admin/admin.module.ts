import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module'; // Admin-specific routing

// Admin components
import { UnitListComponent } from './components/unit-list/unit-list.component';
import { AddGroupsComponent } from './components/add-groups/add-groups.component';
import { AddProductComponent } from '../Pages/add-product/add-product.component';
import { CompanyApprovalComponent } from './components/company-approval/company-approval.component';
import { ProductApprovalComponent } from './components/product-approval/product-approval.component';
import { AdminOrderComponent } from './admin-order/admin-order.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule, // Admin routing
  ],
  declarations: [
    UnitListComponent,
    AddGroupsComponent,
    AddProductComponent,
    CompanyApprovalComponent,
    ProductApprovalComponent,
    AdminOrderComponent,
  ],
  exports: [
    UnitListComponent,
    AddGroupsComponent,
    AddProductComponent,
    CompanyApprovalComponent,
    ProductApprovalComponent,
    AdminOrderComponent,
  ],
})
export class AdminModule {}
