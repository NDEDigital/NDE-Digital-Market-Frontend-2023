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
  groupCode: any = '';
  groupCodePa: string = '';
  isProductPage: boolean = false;
  groupName: string = '';
  selectedGroup: string = '';
  @Output() dataUpdated = new EventEmitter<void>();
  constructor(
    private sharedService: SharedService,
    private goodsData: GoodsDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.groupCode = localStorage.getItem('groupCodes');
    if (this.groupCode) {
      sessionStorage.setItem('groupCodes', this.groupCode);

      // console.log("got the data");
      this.goodsData
        .getProductCompanyList(this.groupCode)
        .subscribe((data: any) => {
          this.companyList = data;
        });
    }
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isProductPage = event.url === '/products-page';
      }
    });

    this.callApi();
  }
  loadCompanyList(groupCode: string, companyCode: string): void {
    console.log('ashce..........', groupCode);
    localStorage.setItem('groupCode', groupCode);

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
  }

  productCardClick(companyCode: string) {
    // alert('he')
    this.sharedService.setCompanyCode(companyCode);
    console.log(companyCode, 'companyCode');
    console.log(this.groupCodePa, 'companyCode');
    let groupCode = localStorage.getItem('groupCode') || '';
    this.router.navigate(['/product'], {
      queryParams: {
        companyCode: btoa(companyCode),
        groupCode: btoa(groupCode),
      },
    });

    // window.location.href = '/product';
  }
}
