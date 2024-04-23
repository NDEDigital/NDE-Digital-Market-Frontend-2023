import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuyerRoutingModule } from './buyer-routing.module';
import { BuyerComponent } from './buyer.component';
import { BannerComponent } from './components/banner/banner.component';
import { BuyerOrderComponent } from './components/buyer-order/buyer-order.component';
import { BuyerOrderDetailsComponent } from './components/buyer-order-details/buyer-order-details.component';
import { ContactSupplierComponent } from './components/contact-supplier/contact-supplier.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavBeltComponent } from './components/nav-belt/nav-belt.component';
import { OrderFlowComponent } from './components/order-flow/order-flow.component';
import { ProductSearchComponent } from './components/product-search/product-search.component';
import { ProductSidebarComponent } from './components/product-sidebar/product-sidebar.component';
import { ProductSliderComponent } from './components/product-slider/product-slider.component';
import { RecommendedProductComponent } from './components/recommended-product/recommended-product.component';
import { WishListComponent } from './components/wish-list/wish-list.component';
import { SubHeaderComponent } from './components/sub-header/sub-header.component';
import { ClientsListSliderComponent } from './components/clients-list-slider/clients-list-slider.component';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BuyerRoutingModule,
    SharedModule,
  ],
  declarations: [
    BuyerComponent,
    BannerComponent,
    BuyerOrderComponent,
    BuyerOrderDetailsComponent,
    ContactSupplierComponent,
    FooterComponent,
    NavBeltComponent,
    OrderFlowComponent,
    ProductSearchComponent,
    ProductSidebarComponent,
    ProductSliderComponent,
    RecommendedProductComponent,
    WishListComponent,
    SubHeaderComponent,
    ClientsListSliderComponent,
  ],
  exports: [
    BannerComponent,
    BuyerOrderComponent,
    BuyerOrderDetailsComponent,
    ContactSupplierComponent,
    FooterComponent,
    NavBeltComponent,
    OrderFlowComponent,
    ProductSearchComponent,
    ProductSidebarComponent,
    ProductSliderComponent,
    RecommendedProductComponent,
    WishListComponent,
    SubHeaderComponent,
    ClientsListSliderComponent,
  ],
})
export class BuyerModule {}
