import { Injectable } from '@angular/core';
import { API_URL } from '../config';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SellerDasboardPermissionService {
  URL = API_URL;

  constructor(private http: HttpClient) { 

  }

  GetSellerDashboardPermission(UserId: any) {

    return this.http.get(`${this.URL}/sellerDashboard/${UserId}`);
    
  }

  GivePermissionToDash(UserId: any,MenuId:any) {
console.log(UserId,MenuId);
    return this.http.post(`${this.URL}/GiveAcessDashboard/${UserId}/${MenuId}`,{});
 
    
  }
  GetPermissionData(userId4:any) {
   
        return this.http.get(`${this.URL}/GetPermissionData/${userId4}`);
     
        
      }





}
