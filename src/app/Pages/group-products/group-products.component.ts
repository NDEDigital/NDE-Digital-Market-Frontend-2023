import { NgModule } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { throwError } from 'rxjs';
import { CompanyService } from 'src/app/services/company.service';
import { GoodsDataService } from 'src/app/services/goods-data.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-group-products',
  templateUrl: './group-products.component.html',
  styleUrls: ['./group-products.component.css'],
})
export class GroupProductsComponent {
  products: any;
  product8 = new Map();
  selectedProductCode: string = '';
  companyList: any;
  products3 = new Map();
  getTopSellerData: any;
  groupCode: string = '';
  groupCodePa: string = '';
  groupNamePa: string = '';
  goods: any;
  groupName: string = '';
  // companyName: string='';
  isGroupProductPage: boolean = false;
  productId: string = '';
  companyCode: string = '';
  @Output() dataUpdated = new EventEmitter<void>();
  filteredProducts: any[] = [];
  @Input() companyName: string = ''; // Accept companyName as input

  constructor(
    private sharedService: SharedService,
    private goodsData: GoodsDataService,
    private router: Router,
    private route: ActivatedRoute,
    private companyService: CompanyService
  ) {
   
  }
  onImageError(event: any): void {
    // If the image is broken or doesn't load, set a fallback source
    event.target.src = '/assets/default-image.jpg';
  }

  ngOnInit() {
    console.log('ngOnInit called');
    this.route.queryParams.subscribe((params) => {
      console.log('Query params:', params);
      if (params['groupCode']) {
        // Decoding groupCode from URL
        this.groupCode = atob(params['groupCode']);
        this.groupCodePa = this.groupCode;
        console.log('GroupCodezz : ', this.groupCode);

        this.getAllProduct(this.groupCode, this.companyCode); // Call getAllProduct with groupCode
        this.CompanyName(this.companyName);
      }
    });

    this.callApi();
  }

  CompanyName(companyName: string): void {
    // Here you can handle the emitted companyName event, if needed
    console.log('Received companyName:', companyName);
    this.companyName = companyName;
  }

  getAllProduct(groupCode: string, companyCode: string): void {

    this.goodsData.getProductList(companyCode, groupCode).subscribe(
      
      (response: any[]) => {
        console.log('Products of groupProducts:', response);
        
        this.products = response; // Update the products array with the response data
        console.log(this.products);
      },
      (error: any) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  handleDataUpdated() {
    this.callApi();
  }

  callApi() {
    setTimeout(() => {
      if (this.groupCode != '') {
        this.goodsData
          .getProductCompanyList(this.groupCode)
          .subscribe((data: any) => {
            this.companyList = data;
          });
      }
    }, 10);
  }

  splitProductKey(key: string) {
    const trimmedKey = key.trim();
    const parts = trimmedKey.split('GG');
    const firstHalf = parts[0].trim();
    // //console.log(firstHalf);
    return firstHalf;
  }

  navigateToData(detail: any) {

    window.open(
      '/productDetails?productId=' +
        btoa(detail.goodsId) +
        '&companyCode=' +
        btoa(detail.companyCode),
      '_blank'
    );
  }
}
