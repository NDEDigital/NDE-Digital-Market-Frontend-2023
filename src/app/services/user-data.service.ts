import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../config';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  //URL = 'https://localhost:7006'; //LocalURL
  URL = API_URL;
  //URL = 'http://172.16.5.18:8081'; // liveURL

  //URL
  createUsersURL = `${this.URL}/CreateUser`;
  UserExistURL = `${this.URL}/UserExist`;
  // GetUsers="";
  loginURL = `${this.URL}/login`;
  getSingleUserURL = `${this.URL}/getSingleUserInfo`;
  passURL = `${this.URL}/updatePass`;
  updateUserURL = `${this.URL}/UpdateUserProfile`;
  bankDataURL = `${this.URL}/api/Goods/BankData`;
  MobileBankingTypeURL = `${this.URL}/api/Goods/MobileBankData`;

  constructor(private http: HttpClient) {}
  UserExist(userData: any) {
    return this.http.post(this.UserExistURL, userData);
  }
  createUser(userData: any) {
    return this.http.post(this.createUsersURL, userData);
  }

  // loginUser(loginData: any) {
  //   return this.http.post(this.loginURL, loginData);
  // }
  loginUser(loginData: any) {
    return this.http.post(this.loginURL, loginData, { withCredentials: true });
  }
  getSingleUser(userId: any) {
    return this.http.get(this.getSingleUserURL, {
      params: { userId },
      withCredentials: true,
    });
  }
  updatePass(passData: any) {
    // //console.log(passData, 'passDatapassData');
    return this.http.put(this.passURL, passData);
    // //console.log('updatepassService aise');
  }
  updateUser(updatedUserData: any) {
    console.log(updatedUserData, 'updatepassService aise');
    return this.http.put(this.updateUserURL, updatedUserData);
  }
  GetAccessToken() {
    return localStorage.getItem('AccessToken');
  }
  GetRefreshToken() {
    return localStorage.getItem('RefreshToken');
  }
  SetAccessToken(AccessToken: any) {
    localStorage.setItem('AccessToken', AccessToken);
  }
  SetRefreshToken(refreshToken: any) {
    localStorage.setItem('RefreshToken', refreshToken);
  }

  RenewToken() {
    //console.log(' refresh token in service ', refreshToken);
    // return this.http.post<any>(`${this.URL}/GenerateRefreshToken`, { token });
    // const formData = new FormData();
    // formData.append('token', refreshToken);
    return this.http.get(`${this.URL}/GenerateRefreshToken`);
  }

  GetBankdata() {
    return this.http.get(this.bankDataURL);
  }

  GetMobileBankingdata() {
    return this.http.get(this.MobileBankingTypeURL);
  }
}
