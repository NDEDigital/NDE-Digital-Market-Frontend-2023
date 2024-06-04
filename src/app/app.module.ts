import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// http client module
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './Pages/home/home.component';
import { BecomeASellerComponent } from './Pages/become-a-seller/become-a-seller.component';
import { ContactSupplierPageComponent } from './Pages/contact-supplier-page/contact-supplier-page.component';
import { ProductsPageComponent } from './Pages/CompanyList/products-page.component';
import { LoginComponent } from './Pages/login/login.component';
import { RegisterComponent } from './Pages/register/register.component';
//From Modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserProfileComponent } from './Pages/user-profile/user-profile.component';
import { ProductComponent } from './Pages/productList/product.component';
import { ChunkPipe } from './services/chunk.pipe';
import { CarouselComponent } from './buyer/components/carousel/carousel.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { SearchResultComponent } from './Pages/search-result/search-result.component';
import { CompareProductComponent } from './Pages/compare-product/compare-product.component';
import { CartAddedProductComponent } from './Pages/cart-added-product/cart-added-product.component';
import { PaymentComponent } from './Pages/payment/payment.component';
import { OrdersOverviewComponent } from './Pages/dashboard/orders-overview/orders-overview.component';
import { CheckoutPageComponent } from './Pages/checkout-page/checkout-page.component';
import { SellerInvoiceComponent } from './ReportDesign/seller-invoice/seller-invoice.component';
import { AdminInvoiceComponent } from './ReportDesign/admin-invoice/admin-invoice.component';
import { ProductDetailsPageComponent } from './Pages/product-details-page/product-details-page.component';
// token
import { UserTokenInterceptor } from './Interceptor/user-token.interceptor';
import { AddProductsComponent } from './modules/admin-layout/components/add-products/add-products.component';
import { UserRegistrationComponent } from './Pages/user-registration/user-registration.component';
import { UserOrdersComponent } from './Pages/user-orders/user-orders.component';
import { InvoiceComponent } from './ReportDesign/invoice/invoice.component';
import { RecommendedProductListComponent } from './Pages/recommended-product-list/recommended-product-list.component';
import { OurTopSellerComponent } from './Pages/our-top-seller/our-top-seller.component';
//module
import { BuyerModule } from './buyer/buyer.module';
import { SharedModule } from './shared/shared.module';
import { GroupProductsComponent } from './Pages/group-products/group-products.component';
import { ProductFilterComponent } from './Pages/product-filter/product-filter.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BecomeASellerComponent,
    ContactSupplierPageComponent,
    ProductsPageComponent,
    LoginComponent,
    RegisterComponent,
    UserProfileComponent,
    ProductComponent,
    ChunkPipe,
    CarouselComponent,
    DashboardComponent,
    SearchResultComponent,
    CompareProductComponent,
    CartAddedProductComponent,
    PaymentComponent,
    OrdersOverviewComponent,
    CheckoutPageComponent,
    SellerInvoiceComponent,
    AdminInvoiceComponent,
    ProductDetailsPageComponent,
    UserRegistrationComponent,
    UserOrdersComponent,
    InvoiceComponent,
    RecommendedProductListComponent,
    OurTopSellerComponent,
    GroupProductsComponent,
    ProductFilterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BuyerModule,
    SharedModule,
    CommonModule,
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
