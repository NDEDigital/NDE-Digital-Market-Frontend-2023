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
  products: string[] = [];
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
  isGroupProductPage:boolean =false;
  productId: string = '';
  companyCode: string = '';
  @Output() dataUpdated = new EventEmitter<void>();
  filteredProducts: any[] = [];
  @Input() companyName: string = ''; // Accept companyName as input

  constructor(
    private goodsDataObj: GoodsDataService,
    private sharedService: SharedService,
    private goodsData: GoodsDataService,
    private router: Router,
    private route: ActivatedRoute,
    private companyService: CompanyService
  ) {
    var groupCode;
    this.route.queryParams.subscribe((params) => {
      groupCode = atob(params['groupCode']);
      this.groupCodePa = groupCode;
      console.log('GroupCode : ', groupCode);
    });
       
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
        console.log('GroupCode : ', this.groupCode);

        // Call getAllProduct with groupCode
        this.getAllProduct(this.groupCode, this.companyName);
      }
    });

    this.callApi();
  }
  // filterProductsByCompany(companyName: string): void {
  //   // Implement the logic to filter products based on the selected company
  //   // For example:
  //   this.goods = this.products.filter(
  //     (product) => product.companyName === companyName
  //   );
  // }

  CompanyName(companyName: string): void {
    // Here you can handle the emitted companyName event, if needed
    console.log('Received companyName:', companyName);
    this.companyName = companyName;
    // this.getAllProductByCompany(companyName, this.groupCode);
    // this.filterProductsByGroupCodeAndCompany(this.groupCode, companyName);
  }

  // filterProductsByGroupCodeAndCompany(
  //   groupCode: string,
  //   companyName: string
  // ): void {
  //   // Filter products by group code
  //   let filteredProducts = this.goods.filter(
  //     (item: any) => item.productGroupName === groupCode
  //   );
  //   console.log('filtered grp: ', groupCode);

  //   // Filter the already filtered products by company name
  //   filteredProducts = filteredProducts.filter(
  //     (item: any) => item.companyName === companyName
  //   );
  //   console.log('filtered cmp', companyName);
  //   // Update the goods array with the filtered products
  //   this.goods = filteredProducts;

  //   // Optionally, you can log the filtered products for debugging
  //   console.log('Filtered products:', this.goods);
  // }

  // ngOnInit() {
  //   this.route.queryParams.subscribe((params) => {
  //     if (params['groupCode'] && params['companyName']) {
  //       // Decoding groupCode from URL
  //       this.groupCode = atob(params['groupCode']);
  //       this.groupCodePa = this.groupCode;

  //       // Decoding companyName from URL
  //       this.companyName = atob(params['companyName']);
  //       this.groupNamePa = this.companyName;

  //       // Logging decoded values
  //       console.log('GroupCode : ', this.groupCode);
  //       console.log('GroupcompanyNameCode : ', this.companyName);

  //       // Call getAllProduct with groupCode and companyName
  //       this.getAllProduct(this.groupCode, this.companyName);
  //     }
  //   });

  //   // Call the API outside the queryParams subscription
  //   this.callApi();

  // }
  // getRecommendedProduct() {
  //   this.companyService.getTopSeller().subscribe({
  //     next: (response: any) => {
  //       console.log(response);
  //       this.getTopSellerData = response;
  //       console.log('data:', this.getTopSellerData);
  //     },
  //     error: (error: any) => {
  //       console.log(error);
  //     },
  //   });
  // }
  handleDataUpdated() {
    this.callApi();
  }

  callApi() {
    // this.groupCode = sessionStorage.getItem('groupCode') || '';
    // this.groupName = sessionStorage.getItem('groupName') || '';
    // console.log("group code is",this.groupCode);

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
  getAllProduct(groupCode: any, companyName: any) {
    // Clear existing products
    this.product8.clear();

    // Fetch data from API and filter products by group code
    this.goodsDataObj.getCarouselData().subscribe(
      (data: any[]) => {
        // Filter products by group code
        this.goods = data.filter((item) => item.productGroupName === groupCode);

        this.products3.clear();
        for (let i = 0; i < this.goods.length; i++) {
          let finObj = this.products3.get(this.goods[i].productGroupName);
          if (finObj) {
            let obj = {
              companyCode: this.goods[i].companyCode,
              companyName: this.goods[i].companyName,
              groupCode: this.goods[i].productGroupID,
              goodsId: this.goods[i].productId,
              groupName: this.goods[i].productGroupName,
              goodsName: this.goods[i].productName,
              specification: this.goods[i].specification,
              approveSalesQty: this.goods[i].availableQty,
              sellerCode: this.goods[i].sellerId,
              unitId: this.goods[i].unitId,
              quantityUnit: this.goods[i].unit,
              imagePath: this.goods[i].imagePath,
              price: this.goods[i].price,
              discountAmount: this.goods[i].discountAmount,
              discountPct: this.goods[i].discountPct,
              netPrice: this.goods[i].totalPrice,
            };
            finObj.push(obj);

            this.products3.set(this.goods[i].productGroupName, finObj);
          } else {
            let obj = {
              companyCode: this.goods[i].companyCode,
              companyName: this.goods[i].companyName,
              groupCode: this.goods[i].productGroupID,
              goodsId: this.goods[i].productId,
              groupName: this.goods[i].productGroupName,
              goodsName: this.goods[i].productName,
              specification: this.goods[i].specification,
              approveSalesQty: this.goods[i].availableQty,
              sellerCode: this.goods[i].sellerId,
              unitId: this.goods[i].unitId,
              quantityUnit: this.goods[i].unit,
              imagePath: this.goods[i].imagePath,
              price: this.goods[i].price,
              discountAmount: this.goods[i].discountAmount,
              discountPct: this.goods[i].discountPct,
              netPrice: this.goods[i].totalPrice,
            };
            this.products3.set(this.goods[i].productGroupName, [obj]);
          }
          console.log(this.products3, ' ut');
        }
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Handle unauthorized error
          //console.error('Unauthorized Error', error);
        }
        // You can choose to throw an error or handle it differently based on your requirements
        throwError('Error occurred');
      }
    );
  }

  
  navigateToData(detail: any) {
    // sessionStorage.setItem('productData', JSON.stringify(detail));
    // console.log(detail);
    // alert('hh');
    //console.log('dashboard', detail);
    window.open(
      '/productDetails?productId=' +
        btoa(detail.goodsId) +
        '&companyCode=' +
        btoa(detail.companyCode),
      '_blank'
    );
  }
}
