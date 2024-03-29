import { Injectable } from '@angular/core';
import { API_URL } from '../config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  URL = API_URL;
  createCompanyURL = `${this.URL}/api/CompanyRegistration/CreateCompany`;
  payMethodCompanyURL = `${this.URL}/api/HK_Gets/PreferredPaymentMethods`;
  preferredBankNamesURL = `${this.URL}/api/HK_Gets/PreferredBankNames`;
  GetCompaniesBasedOnStatusURL = `${this.URL}/api/CompanyRegistration/GetCompaniesBasedOnStatus`;
  UpdateCompanyURL = `${this.URL}/api/CompanyRegistration/UpdateCompany`;
  constructor(private http: HttpClient) {}
  createCompany(companyData: any) {
    return this.http.post(this.createCompanyURL, companyData);
  }
  getpayMethod() {
    return this.http.get(this.payMethodCompanyURL);
  }

  PreferredBankNames(preferredPM: any) {
    return this.http.get(this.preferredBankNamesURL, {
      params: { preferredPM },
    });
  }
  GetCompaniesBasedOnStatus(status: any) {
    return this.http.get(this.GetCompaniesBasedOnStatusURL, {
      params: { status },
    });
  }
  UpdateCompany(companyDto: any) {
    // console.log('Data sent to server:', companyDto);
    return this.http.put(this.UpdateCompanyURL, companyDto);
  }

  
  GetSellerList(status: any) {
    // console.log("GetSellerList",status);
    if(status==1){
      status=true
    }
    else{
      status=false;
      // alert(status);
    }
    // console.log("the status",status);
    return this.http.get(`${this.URL}/CompanySellerDetails/${localStorage.getItem('code')}/${status}`);
    
  }






  

  GetSellerInAdmin(status:any,selectedValue:any){
    if(status==1){
      status=true
    }
    else{
      status=false;
    }
    // console.log(selectedValue);
    
    return this.http.get(`${this.URL}/getSellerActive&Inactive/${true}?CompanyCode=${selectedValue}&IsActive=${status}`);
    // getSellerActive&Inactive/false?CompanyCode=dfasd&IsActive=true
  }


  GetBuyerInAdmin(status:any){
    if(status==1){
      status=true
    }
    else{
      status=false;
    }
    
    return this.http.get(`${this.URL}/getBuyerInAdmin/${true}?IsActive=${status}`);


  }

  GetDropdownValues(){
 
    return this.http.get(`${this.URL}/api/CompanyRegistration/GetCompaniesBasedOnStatus?status=${1}`);



  }






  UpdateSellerActiveInActive(userIds: string, isActive: boolean) {
    return this.http.put(`${this.URL}/updateSellerActive&Inactive?userIds=${userIds}&isActive=${isActive}`, {});
  }
  





}
