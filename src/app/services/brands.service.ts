import { Injectable } from '@angular/core';
import { API_URL } from '../config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs'; // Import Observable from 'rxjs'
@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  constructor(private http: HttpClient) {}
  URL = API_URL;
  updateBrandURL = `${this.URL}/api/Brands/UpdateBrand`;
  getBrandsURL = `${this.URL}/api/Brands/GetBrandList`;
  insertBrandURL = `${this.URL}/api/Brands/AddBrand`;
  // updateActiveStatusByUnitIdURL = `${this.URL}/api/Unit/UpdateUnitByID`;
  updateActiveStatusByUnitsIdURL = `${this.URL}/api/Brands/ChangeBrandsStatus?BrandIDs=`;

  getBrands(status: any) {
    //console.log(this.getUnitURL, status);
    return this.http.get(`${this.getBrandsURL}?isActive=${status}`);
  }
  getNewBrands() {
    //console.log(this.getUnitURL);
    return this.http.get(`${this.getBrandsURL}`);
  }
  updateBrand(UnitName: any) {
    //console.log('Update', UnitName);
    return this.http.put(this.updateBrandURL, UnitName);
  }
  createBrand(addUnit: any): Observable<any> {
    //console.log('insert', addUnit);
    return this.http.post<any>(`${this.insertBrandURL}`, addUnit);
  }

  // updateBrandsActiveStatus(UnitID: any, isActive: any) {
  //   //console.log('Update', UnitID);
  //   return this.http.put(
  //     `${this.updateActiveStatusByUnitIdURL}?unitID=${UnitID}&isActive=${isActive}`,
  //     {}
  //   );
  // }

  updateUnitsActiveStatus(UnitID: any, isActive: any) {
    //console.log('Update', UnitID);
    return this.http.put(
      `${this.updateActiveStatusByUnitsIdURL}${UnitID}&isActive=${isActive}`,
      {}
    );
  }
}
