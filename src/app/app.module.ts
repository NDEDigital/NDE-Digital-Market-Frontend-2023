import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// http client module
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './Pages/home/home.component';
import { BecomeASellerComponent } from './Pages/become-a-seller/become-a-seller.component';
import { CardComponent } from './Components/card/card.component';
import { ContactSupplierPageComponent } from './Pages/contact-supplier-page/contact-supplier-page.component';
import { ProductsPageComponent } from './Pages/CompanyList/products-page.component';
import { LoginComponent } from './Pages/login/login.component';
import { RegisterComponent } from './Pages/register/register.component';
//From Modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserProfileComponent } from './Pages/user-profile/user-profile.component';
import { MaxQuantityProductsSliderComponent } from './Components/max-quantity-products-slider/max-quantity-products-slider.component';

import { ProductComponent } from './Pages/productList/product.component';
import { ChunkPipe } from './services/chunk.pipe';
import { CarouselComponent } from './Components/carousel/carousel.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { ProductCardComponent } from './Components/product-card/product-card.component';
import { SearchResultComponent } from './Pages/search-result/search-result.component';
import { ErrorComponent } from './Components/error/error.component';
import { CompareProductComponent } from './Pages/compare-product/compare-product.component';
import { CartAddedProductComponent } from './Pages/cart-added-product/cart-added-product.component';
import { PaymentHeaderComponent } from './Components/payment-header/payment-header.component';
import { PaymentComponent } from './Pages/payment/payment.component';
import { OrdersOverviewComponent } from './Pages/dashboard/orders-overview/orders-overview.component';
import { HomeCoreContentComponent } from './Components/home-core-content/home-core-content.component';
import { HomeProductCardComponent } from './Components/home-product-card/home-product-card.component';
import { CheckoutPageComponent } from './Pages/checkout-page/checkout-page.component';
import { SellerInvoiceComponent } from './ReportDesign/seller-invoice/seller-invoice.component';
import { AdminInvoiceComponent } from './ReportDesign/admin-invoice/admin-invoice.component';
import { ProductDetailsPageComponent } from './Pages/product-details-page/product-details-page.component';
import { AutoFocusOtpFieldComponent } from './Components/auto-focus-otp-field/auto-focus-otp-field.component';
import { OtpModalComponent } from './shared/otp-modal/otp-modal.component';
// token
import { UserTokenInterceptor } from './Interceptor/user-token.interceptor';
import { AddProductsComponent } from './admin/components/add-products/add-products.component';
import { UserRegFormComponent } from './Components/user-reg-form/user-reg-form.component';
import { UserRegistrationComponent } from './Pages/user-registration/user-registration.component';
import { UserOrdersComponent } from './Pages/user-orders/user-orders.component';
import { InvoiceComponent } from './ReportDesign/invoice/invoice.component';
import { LoginPopupComponent } from './shared/login-popup/login-popup.component';
import { SellerListComponent } from './shared/seller-list/seller-list.component';
import { RecommendedProductListComponent } from './Pages/recommended-product-list/recommended-product-list.component';
import { OurTopSellerComponent } from './Pages/our-top-seller/our-top-seller.component';
//module
import { AdminModule } from './admin/admin.module';
import { BuyerModule } from './buyer/buyer.module';
import { SellerModule } from './seller/seller.module';
import { SharedModule } from './shared/shared.module';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BecomeASellerComponent,
    CardComponent,
    ContactSupplierPageComponent,
    ProductsPageComponent,
    LoginComponent,
    RegisterComponent,
    UserProfileComponent,
    MaxQuantityProductsSliderComponent,
    ProductComponent,
    ChunkPipe,
    CarouselComponent,
    DashboardComponent,
    ProductCardComponent,
    SearchResultComponent,
    ErrorComponent,
    CompareProductComponent,
    CartAddedProductComponent,
    PaymentHeaderComponent,
    PaymentComponent,
    OrdersOverviewComponent,
    HomeCoreContentComponent,
    HomeProductCardComponent,
    CheckoutPageComponent,
    SellerInvoiceComponent,
    AdminInvoiceComponent,
    ProductDetailsPageComponent,
    AutoFocusOtpFieldComponent,
    OtpModalComponent,
    AddProductsComponent,
    UserRegFormComponent,
    UserRegistrationComponent,
    UserOrdersComponent,
    InvoiceComponent,
    LoginPopupComponent,
    SellerListComponent,
    RecommendedProductListComponent,
    OurTopSellerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AdminModule,
    BuyerModule,
    SellerModule,
    SharedModule,
  ],
  exports: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UserTokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
