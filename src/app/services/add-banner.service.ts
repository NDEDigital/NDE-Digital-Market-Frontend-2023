import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AddBannerService {
  createBannerURL = 'https://localhost:7006/api/AddBanner/AddBanner';
  // deleteURL = 'https://localhost:7006/api/AddBanner/DeleteBanner/${bannerId}';

  editURL = 'https://localhost:7006/api/AddBanner/UpdateBanner';

  getURL = 'https://localhost:7006/api/AddBanner/GetAddBanner';
  constructor(private http: HttpClient) {}

  addBanner(formData: FormData): Observable<any> {
    return this.http.post<any>(this.createBannerURL, formData);
  }

  createBanner(productListInsertData: any) {
    console.log(productListInsertData);
    return this.http.post(this.createBannerURL, productListInsertData);
  }

  deleteBanner(bannerId: any): Observable<any> {
    const deleteURL = `https://localhost:7006/api/AddBanner/DeleteBanner/${bannerId}`;
    return this.http.delete<any>(deleteURL);
  }
  // editBanner(bannerId: any, formData: FormData) {
  //   return this.http.put(
  //     `https://localhost:7006/api/AddBanner/UpdateBanner/${bannerId}`,
  //     formData
  //   );
  // }

  editBanner(bannerId: any, formData: FormData) {
    return this.http.put<any>(`editURL/${bannerId}`, formData);
  }

  getBanner(status: any) {
    return this.http.get(this.getURL, {
      params: { status },
    });
  }
}
