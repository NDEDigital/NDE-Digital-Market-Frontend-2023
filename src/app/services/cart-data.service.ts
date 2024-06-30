import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from '../Pages/cart-added-product/cart-item.interface';
import { API_URL } from '../config';
@Injectable({
  providedIn: 'root',
})
export class CartDataService {
  URL = API_URL;
  createAddCartDataByBuyerURL = `${this.URL}/api/AddToCart/AddToCartData`;
  getAddToCartDataByBuyerURL = `${this.URL}/api/AddToCart/GetAddToCartData`;
  deleteCartDataByBuyerURL = `${this.URL}/api/AddToCart/DeleteAddToCart`;
  constructor(private http: HttpClient) {}
  private cartCount: number = 0;
  private cartDataDetail = new Map<string, CartItem>();
  private cartDataQt = new Map<string, number>();
  private totalPrice: number = 0.0;
  private totalPriceWithDelivery = 0;
  // private saveLaterDataDetail = new Map<string, CartItem>();
  // private saveLaterDataQt = new Map<string, number>();
  createAddCartDataByByer(addToCart: any) {
    return this.http.post(this.createAddCartDataByBuyerURL, addToCart);
  }
  getAddToCartDataByBuyer(userID: string) {
    console.log(userID, 'getAddToCartDataByBuyer');
    return this.http.get(`${this.getAddToCartDataByBuyerURL}/${userID}`);
  }
  deleteCartDataByBuyer(productID: any) {
    return this.http.delete(
      `${this.deleteCartDataByBuyerURL}?id=${encodeURIComponent(productID)}`
    );
  }
 
}
