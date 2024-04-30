import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
@Injectable({
  providedIn: 'root',
})
export class AddBannerService {
  URL = API_URL;
  createBannerURL = `${this.URL}/api/AddBanner/AddBanner`;
  // deleteURL = 'https://localhost:7006/api/AddBanner/DeleteBanner/${bannerId}';

  editURL = `${this.URL}/api/AddBanner/UpdateBanner`;
  getBannerDataByAdminURL = `${this.URL}/api/AddBanner/GetAddBannerForAdmin`;
  getURL = `${this.URL}/AddBanner/GetAddBanner`;
  UpdateBannerStatusURL = `${this.URL}/api/AddBanner/UpdateBannerStatus`;
  getBannerForShowingInHomePageURL = `${this.URL}/api/AddBanner/GetBannerForShowingInHomePage`;
  constructor(private http: HttpClient) {}

  addBanner(formData: FormData): Observable<any> {
    return this.http.post<any>(this.createBannerURL, formData);
  }

  getaAllBanner(CompanyCode: any) {
    console.log(CompanyCode);
    const getaAllURL = `${this.URL}/api/AddBanner/GetAddBannerForSeller?ComapnayCode=${CompanyCode}`;

https: return this.http.get<any>(getaAllURL);
  }

  createBanner(productListInsertData: any) {
    console.log(productListInsertData);
    return this.http.post(this.createBannerURL, productListInsertData);
  }

  deleteBanner(bannerId: any): Observable<any> {
    const deleteURL = `${this.URL}/api/AddBanner/DeleteBanner/${bannerId}`;
    return this.http.delete<any>(deleteURL);
  }
  // editBanner(bannerId: any, formData: FormData) {
  //   return this.http.put(
  //     `https://localhost:7006/api/AddBanner/UpdateBanner/${bannerId}`,
  //     formData
  //   );
  // }

  updateBanner(formData: any): Observable<any> {
    return this.http.put(this.editURL, formData);
  }

  getBannerDataByAdmin(status: any) {
    if (status == -1) {
      return this.http.get(this.getBannerDataByAdminURL);
    } else if (status == 1) {
      status = true;
      return this.http.get(`${this.getBannerDataByAdminURL}?status=${status}`);
    } else {
      status = false;
      return this.http.get(`${this.getBannerDataByAdminURL}?status=${status}`);
    }
  }
  UpdateBannerStatus(formdata: any) {
    return this.http.put(this.UpdateBannerStatusURL, formdata);
  }
  getBannerForShowingInHomePage() {
    return this.http.get(this.getBannerForShowingInHomePageURL);
  }
}
