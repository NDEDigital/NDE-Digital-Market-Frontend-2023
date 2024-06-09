import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { GoodsDataService } from 'src/app/services/goods-data.service';
import { SharedService } from 'src/app/services/shared.service';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css'],
})
export class ProductsPageComponent {
  products: string[] = [];
  selectedProductCode: string = '';
  companyList: any;
  groupCode: string = '';
  groupCodePa: string = '';
  isProductPage: boolean = false;
  groupName: string = '';
  @Output() dataUpdated = new EventEmitter<void>();
  constructor(
    private sharedService: SharedService,
    private goodsData: GoodsDataService,
    private router: Router,
    private route: ActivatedRoute
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
            console.log('data ashce', this.companyList);
          });
      }
    });
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isProductPage = event.url === '/products-page';
      }
    });

    this.route.queryParams.subscribe((params) => {
      this.groupCode = atob(params['groupCode'] || '');
      this.groupCodePa = this.groupCode;

      if (this.groupCode) {
        sessionStorage.setItem('groupCode', this.groupCode);
        this.loadCompanyList(this.groupCode);
      }
    });

    this.callApi();
  }
  loadCompanyList(groupCode: string): void {
    this.goodsData.getProductCompanyList(groupCode).subscribe((data: any) => {
      this.companyList = data;
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
            console.log('company: ', this.companyList);
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

  productCardClick(companyCode: string) {
    // alert('he')
    this.sharedService.setCompanyCode(companyCode);
    // //console.log(companyCode, 'companyCode');

    this.router.navigate(['/product'], {
      queryParams: {
        companyCode: btoa(companyCode),
        groupCode: btoa(this.groupCodePa),
      },
    });

    // window.location.href = '/product';
  }
}
