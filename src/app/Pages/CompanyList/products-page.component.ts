import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  groupName: string = '';
  @Output() dataUpdated = new EventEmitter<void>();
  constructor(
    private sharedService: SharedService,
    private goodsData: GoodsDataService,
    private router: Router,
 private route: ActivatedRoute
  ) {
    var groupCode;
    // var groupCode;
    this.route.queryParams.subscribe(params => {

      groupCode = params['groupCode'];
      console.log('Group Code in constructor 1:', this.groupCode);
      if (groupCode) {
        console.log("got the data");
        this.goodsData.getProductCompanyList(groupCode).subscribe((data: any) => {
          this.companyList = data;
          this.sharedService.setNavSelectData(this.groupCode,'');


        });
      }
    });

    
  }

  ngOnInit() {
this.callApi()
  }

  handleDataUpdated() {
 

      this.callApi();
 
    
  }

  callApi() {
    this.groupCode = sessionStorage.getItem('groupCode') || '';
    this.groupName = sessionStorage.getItem('groupName') || '';
    // //console.log(this.groupName, this.groupCode, 'products inside callapi');
    setTimeout(() => {
      if (this.groupCode !='') {
        this.goodsData
          .getProductCompanyList(this.groupCode)
          .subscribe((data: any) => {
  
            this.companyList = data;
            this.router.navigate(['/productsPageComponent'], { queryParams: { groupCode: this.groupCode } });
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
    this.sharedService.setCompanyCode(companyCode);
    // //console.log(companyCode, 'companyCode');

    this.router.navigate(['/product']);
    // window.location.href = '/product';
  }
}
