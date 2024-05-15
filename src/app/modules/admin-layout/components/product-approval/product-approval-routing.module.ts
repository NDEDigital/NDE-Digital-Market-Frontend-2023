import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductApprovalComponent } from './product-approval.component';

const routes: Routes = [{ path: '', component: ProductApprovalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductApprovalRoutingModule { }
