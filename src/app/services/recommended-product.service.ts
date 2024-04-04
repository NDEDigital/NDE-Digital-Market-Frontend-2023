import { Injectable } from '@angular/core';
import { API_URL } from '../config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecommendedProductService {
  URL = API_URL;
  getRecommendedProduct = `${this.URL}/api/Goods/GetRecommendedProductList`;

  constructor(private http: HttpClient) {}
  GetRecommendedProductDetailsData(CompanyCode: any, productId: any) {
    return this.http.get(
      `${this.getRecommendedProduct}/${CompanyCode}/${productId}`
    );
  }
}
