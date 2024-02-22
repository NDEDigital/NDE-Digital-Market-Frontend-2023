import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { compileNgModule } from '@angular/compiler';
import { API_URL } from '../config';
import { ActivatedRoute, Router, Params } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class GoodsDataService implements OnInit{
  private navData: any[] = [];
  private allData: any[] = [];
  private companyList: any;
  private productType: any;
  private carousalData: any;

  private groupCode: string = '';
  private groupName: string = '';
  private companyCode: string = '';
  private detailData: any;

  item: number = 20;
  page: number = 0;
  searchKey: string = 'a';
  sortedKey: string = 'NAME';
  URL = API_URL;
  // URL = 'https://localhost:7006'; // LocalURL
  //URL = 'http://172.16.5.18:8081'; // liveURL

  getGoodsListURL = `${this.URL}/api/Goods/GetGoodsList`;
  sellersProductListURL = `${this.URL}/GetProduct`;
  navUrl = `${this.URL}/api/Goods/GetNavData`;
  dropDownGroupUrl= `${this.URL}/api/Goods/GetDataForDropdown`;

  searchProuct = '';
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    // this.router.navigate(['/productsPageComponent'], { queryParams: { groupCode: this.groupCode } });
  
  
  }

ngOnInit(): void {

  
}

  getSearchResult() {
    this.searchProuct = `${this.URL}/api/ProductSearch/GetSearchedProduct?productName=${this.searchKey}&sortDirection=${this.sortedKey}&nextCount=${this.item}&offset=${this.page}`;
    // console.log(this.searchKey, 'ddddd', this.searchProuct);
    return this.http
      .get<any[]>(this.searchProuct)
      .pipe(tap((response: any[]) => {}));
  }

  getNavData() {
    return this.http.get<any[]>(this.navUrl).pipe(
      tap((response: any[]) => {
        this.navData = response;
      })
    );
  }


  setDetailData(entry: any) {
    this.detailData = entry;
  }
  getDetaileData() {
    return this.detailData;
  }

  getCarouselData() {
    const carouselURL = `${this.URL}/api/Goods/GetGoodsList`;
    return this.http.get<any[]>(carouselURL).pipe(
      tap((response: any[]) => {
        this.carousalData = response;
        // console.log("you are in home");
        
        // console.log(this.companyList,"");
      }),

      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getProductCompanyList(groupCode: string) {
    this.groupCode = sessionStorage.getItem('groupCode') || '';
    this.groupName = sessionStorage.getItem('groupName') || '';
    // console.log(this.groupCode, 'groupCode', this.groupName, 'groupname');
    
    // const encodedGroupName = encodeURIComponent(this.groupName);
    // console.log('encodedGroupName ', encodedGroupName);
    const productCompany = `${this.URL}/api/Goods/GetProductCompany/${groupCode}`;
    // console.log(productCompany, ' produ');
    // console.log("hello 1");


    return this.http.get<any[]>(productCompany).pipe(
      tap((response: any[]) => {
        this.companyList = response;
        
     
   
      }),
      catchError((error: any) => {
        console.error('Error:', error);
        return throwError(() => error);
      })
      
    );
}


  getProductList(companyCode: string) {
    // this.companyCode = companyCode;
    // console.log(companyCode," ----------");

    this.companyCode = sessionStorage.getItem('companyCode') || '';
    this.groupName = localStorage.getItem('activeEntry') || '';
    this.groupCode = sessionStorage.getItem('groupCode') || '';

    const productCompany = `${this.URL}/api/Goods/GetProductList?CompanyCode=${this.companyCode}&ProductGroupCode=${this.groupCode}`;

    return this.http.get<any[]>(productCompany).pipe(
      tap((response: any[]) => {
        this.productType = response;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  products(sellerCode: any) {
    return this.http.get(this.sellersProductListURL, {
      params: { sellerCode },
    });
  }

  getGroupData(){
    return this.http.get<any[]>(this.dropDownGroupUrl).pipe(
      tap((response: any[]) => {
        this.navData = response;
      })
    );
   }
  
  // review and ratings

  getReviewRatingsData(productId: any) {
    // console.log(productId, 'ProductId');
    const url = `${this.URL}/api/ReviewAndRating/getReviewRatingsDataForDetailsPage`;
    // const url = `${this.baseUrl}/GetOrderData/${pageNumber}/${pageSize}/${status} `;
    return this.http.get(url, {
      params: { ProductId: productId.toString() }, // Ensure productId is a string
    });
  }

  UrlGetOfHome(productId: Number,companyCode:string) {
    // console.log(productId, 'ProductId');
    // console.log(companyCode,'companycde');
    
    const url = `${this.URL}/api/Goods/GetGoodsDetails/${companyCode}/${productId}`;
 
    return this.http.get(url, {
      params: {}, // Ensure productId is a string
    });
  }





}
