import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import the admin components
import { UnitListComponent } from './components/unit-list/unit-list.component';
import { AddGroupsComponent } from './components/add-groups/add-groups.component';
import { AddProductComponent } from '../Pages/add-product/add-product.component';
import { CompanyApprovalComponent } from './components/company-approval/company-approval.component';
import { ProductApprovalComponent } from './components/product-approval/product-approval.component';
import { AdminOrderComponent } from './components/admin-order/admin-order.component';

// Define the routes for the admin module
const routes: Routes = [
  { path: 'unit-list', component: UnitListComponent },
  { path: 'add-groups', component: AddGroupsComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'company-approval', component: CompanyApprovalComponent },
  { path: 'product-approval', component: ProductApprovalComponent },
  { path: 'admin-order', component: AdminOrderComponent },
  { path: '', redirectTo: 'unit-list', pathMatch: 'full' }, // Default route for admin module
];

// Configure the routing module
@NgModule({
  imports: [RouterModule.forChild(routes)], // Use forChild to import child routes
  exports: [RouterModule], // Export RouterModule to make it available to other modules
})
export class AdminRoutingModule {}
