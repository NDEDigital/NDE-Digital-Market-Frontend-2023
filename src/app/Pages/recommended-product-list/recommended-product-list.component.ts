import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoodsDataService } from 'src/app/services/goods-data.service';
import { SharedService } from 'src/app/services/shared.service';
import { switchMap } from 'rxjs/operators';
import { RecommendedProductService } from 'src/app/services/recommended-product.service';

@Component({
  selector: 'app-recommended-product-list',
  templateUrl: './recommended-product-list.component.html',
  styleUrls: ['./recommended-product-list.component.css'],
})
export class RecommendedProductListComponent {
  products: string[] = [];
  selectedProductCode: string = '';
  companyList: any;

  getTopSellerData: any;
  groupCode: string = '';
  groupCodePa: string = '';

  groupName: string = '';

  productId: string = '';
  companyCode: string = '';
  @Output() dataUpdated = new EventEmitter<void>();
  constructor(
    private sharedService: SharedService,
    private goodsData: GoodsDataService,
    private router: Router,
    private route: ActivatedRoute,
    private recommendedServices: RecommendedProductService
  ) {
    var groupCode;
    this.route.queryParams.subscribe((params) => {
      groupCode = atob(params['groupCode']);
      this.groupCodePa = groupCode;
      if (groupCode) {
        sessionStorage.setItem('groupCode', groupCode);

        // console.log("got the data");
        this.goodsData
          .getProductCompanyList(groupCode)
          .subscribe((data: any) => {
            this.companyList = data;
          });
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['productId']) {
        // Assuming productId is encoded and needs to be decoded
        this.productId = atob(params['productId']);
      }
      if (params['companyCode']) {
        // Assuming companyCode is encoded and needs to be decoded
        this.companyCode = atob(params['companyCode']);
      }
      this.getRecommendedProduct(this.companyCode, this.productId);
      console.log('Product ID:', this.productId);
      console.log('Company Code:', this.companyCode);
    });

    this.callApi();
  }
  getRecommendedProduct(companyCode: any, productId: any) {
    this.recommendedServices
      .GetRecommendedProductDetailsData(companyCode, productId)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.getTopSellerData = response;
          console.log('data:', this.getTopSellerData);
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }
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

    //================= using switchMap ==============
    // this.goodsData
    //   .getProductCompanyList(
    //     this.sharedService.groupCode,
    //     this.sharedService.groupName
    //   )
    //   .pipe(
    //     switchMap(() =>
    //       this.goodsData.getProductCompanyList(
    //         this.sharedService.groupCode,
    //         this.sharedService.groupName
    //       )
    //     )
    //   )
    //   .subscribe((data: any) => {
    //     //console.log(data);
    //     this.companyList = data;
    //   });
  }

  productCardClick(product: any) {
    // alert('he')
    this.sharedService.setCompanyCode(product.companyCode);
    console.log(product, 'companyCode');

    window.open(
      '/productDetails?productId=' +
        btoa(product.productId) +
        '&companyCode=' +
        btoa(product.companyCode),
      '_blank'
    );

    // window.location.href = '/product';
  }
}
