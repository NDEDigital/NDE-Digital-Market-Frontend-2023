import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyApprovalComponent } from './company-approval.component';

const routes: Routes = [{ path: '', component: CompanyApprovalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyApprovalRoutingModule { }
