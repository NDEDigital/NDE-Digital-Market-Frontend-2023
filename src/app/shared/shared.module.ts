import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorComponent } from './components/error/error.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginPopupComponent } from './components/login-popup/login-popup.component';
import { OtpModalComponent } from './components/otp-modal/otp-modal.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SellerListComponent } from './components/seller-list/seller-list.component';
import { UserRegFormComponent } from './components/user-reg-form/user-reg-form.component';
import { SharedRoutingModule } from './shared-routing.module';
import { DashboardMenuHeaderComponent } from './components/dashboard-menu-header/dashboard-menu-header.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedRoutingModule,
  ],

  declarations: [
    ErrorComponent,
    HeaderComponent,
    LoginPopupComponent,
    OtpModalComponent,
    PaginationComponent,
    SellerListComponent,
    UserRegFormComponent,
    DashboardMenuHeaderComponent,
  ],
  exports: [
    ErrorComponent,
    HeaderComponent,
    LoginPopupComponent,
    OtpModalComponent,
    PaginationComponent,
    SellerListComponent,
    UserRegFormComponent,
    DashboardMenuHeaderComponent,
  ],
})
export class SharedModule {}
