import { Injectable } from '@angular/core';
import { API_URL } from '../config';

import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  URL = API_URL;
  



  constructor(private http: HttpClient) { }


  InsertWishList(UserId:any,ProductId:any,CompanyCode:any) {
    // console.log(UserId,MenuId);
        return this.http.post(`${this.URL}/api/WishList/InsertWishList/${UserId}/${ProductId}/${CompanyCode}`,{});
     
        
      }
      DeleteWishList(UserId:any,ProductId:any,CompanyCode:any) {
      
            return this.http.delete(`${this.URL}/api/WishList/DeleteWishList/${UserId}/${ProductId}/${CompanyCode}`,{});
         
            
          }


}
