import { Injectable } from '@angular/core';
import { API_URL } from '../config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs'; // Import Observable from 'rxjs'
@Injectable({
  providedIn: 'root',
})
export class UnitService {
  constructor(private http: HttpClient) {}
  URL = API_URL;
  updateUnitNameURL = `${this.URL}/api/Unit/UpdateUnit`;
  getUnitURL = `${this.URL}/api/Unit/GetUnitList`;
  insertUnitURL = `${this.URL}/api/Unit/AddUnit`;
  updateActiveStatusByUnitIdURL = `${this.URL}/api/Unit/UpdateUnitByID`;
  updateActiveStatusByUnitsIdURL = `${this.URL}/api/Unit/UpdateUnitsByID?unitIDs=`;
  getUnitGroups(status: any) {
    //console.log(this.getUnitURL, status);
    return this.http.get(`${this.getUnitURL}?isActive=${status}`);
  }
  getUnitGroup() {
    //console.log(this.getUnitURL);
    return this.http.get(`${this.getUnitURL}`);
  }
  updateUnitName(UnitName: any) {
    //console.log('Update', UnitName);
    return this.http.put(this.updateUnitNameURL, UnitName);
  }
  createUnit(addUnit: any): Observable<any> {
    //console.log('insert', addUnit);
    return this.http.post<any>(`${this.insertUnitURL}`, addUnit);
  }

  updateUnitActiveStatus(UnitID: any, isActive: any) {
    //console.log('Update', UnitID);
    return this.http.put(
      `${this.updateActiveStatusByUnitIdURL}?unitID=${UnitID}&isActive=${isActive}`,
      {}
    );
  }
  updateUnitsActiveStatus(UnitID: any, isActive: any) {
    //console.log('Update', UnitID);
    return this.http.put(
      `${this.updateActiveStatusByUnitsIdURL}${UnitID}&isActive=${isActive}`,
      {}
    );
  }
}
