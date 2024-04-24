import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoodsDataService } from 'src/app/services/goods-data.service';
import { SharedService } from 'src/app/services/shared.service';
import { switchMap } from 'rxjs/operators';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-our-top-seller',
  templateUrl: './our-top-seller.component.html',
  styleUrls: ['./our-top-seller.component.css'],
})
export class OurTopSellerComponent {
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
    private companyService: CompanyService
  ) {
    var groupCode;
    this.route.queryParams.subscribe((params) => {
      groupCode = atob(params['groupCode']);
      this.groupCodePa = groupCode;
      console.log('GroupCode : ', groupCode);
      // if (groupCode) {
      //   sessionStorage.setItem('groupCode', groupCode);

      //   // console.log("got the data");
      //   this.goodsData
      //     .getProductCompanyList(groupCode)
      //     .subscribe((data: any) => {
      //       this.companyList = data;
      //     });
      // }
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
      this.getRecommendedProduct();
      console.log('Product ID:', this.productId);
      console.log('Company Code:', this.companyCode);
    });

    this.callApi();
  }
  getRecommendedProduct() {
    this.companyService.getTopSeller().subscribe({
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

  productCardClick(companyCode: string, productGroupCode: string) {
    // alert('he')
    this.sharedService.setCompanyCode(companyCode);
    // //console.log(companyCode, 'companyCode');

    this.router.navigate(['/product'], {
      queryParams: {
        companyCode: btoa(companyCode),
        groupCode: btoa(productGroupCode),
      },
    });

    // window.location.href = '/product';
  }
}
