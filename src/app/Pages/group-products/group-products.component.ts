import { NgModule } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  HostListener,
} from '@angular/core';
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
  groupCode: any = '';
  groupCodePa: string = '';
  groupNamePa: string = '';
  goods: any;
  groupName: string = '';
  // companyName: string='';
  isGroupProductPage: boolean = false;
  productId: string = '';
  companyCode: any = '';
  @Output() dataUpdated = new EventEmitter<void>();
  filteredProducts: any[] = [];
  @Input() companyName: string = ''; // Accept companyName as input
  title = true;
  filter = false;
  notfilter = false;
  constructor(
    private sharedService: SharedService,
    private goodsData: GoodsDataService,
    private router: Router,
    private route: ActivatedRoute,
    private companyService: CompanyService
  ) {
    this.groupCode = localStorage.getItem('groupCode');
  }
  onImageError(event: any): void {
    // If the image is broken or doesn't load, set a fallback source
    event.target.src = '/assets/default-image.jpg';
  }

  ngOnInit() {
    console.log('ngOnInit called');
    this.getAllProduct(this.groupCode, this.companyCode);
    this.CompanyName(this.companyName);
    // this.callApi();
    this.checkWindowWidth();
  }

  CompanyName(companyName: string): void {
    // Here you can handle the emitted companyName event, if needed
    console.log('Received companyName:', companyName);
    this.companyName = companyName;
  }
  toggleButton() {
    this.filter = !this.filter;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWindowWidth();
  }

  checkWindowWidth() {
    if (window.innerWidth > 768) {
      this.filter = false;
    }
    if (window.innerWidth > 768) {
      this.notfilter = true;
    }
    if (window.innerWidth < 768) {
      this.notfilter = false;
    }
  }
  getAllProduct(groupCode: string, companyCode: string): void {
    console.log(groupCode, companyCode);
    localStorage.setItem('groupCode', groupCode);
    localStorage.setItem('companyCodeFilter', companyCode);
    if (groupCode) {
      this.title = true;
    } else {
      this.title = false;
    }
    console.log(groupCode, companyCode);

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

    console.log('kaj hoise');
  }
  truncateString(str: any, maxLength: any) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + '...';
    } else {
      return str;
    }
  }
  handleDataUpdated() {
    // this.callApi();
  }

  // callApi() {
  //   setTimeout(() => {
  //     if (this.groupCode != '') {
  //       this.goodsData
  //         .getProductCompanyList(this.groupCode)
  //         .subscribe((data: any) => {
  //           this.companyList = data;
  //         });
  //     }
  //   }, 10);
  // }

  splitProductKey(key: string) {
    const trimmedKey = key.trim();
    const parts = trimmedKey.split('GG');
    const firstHalf = parts[0].trim();
    // //console.log(firstHalf);
    return firstHalf;
  }

  navigateToData(detail: any) {
    console.log(detail);
    window.open(
      '/productDetails?productId=' +
        btoa(detail.productId) +
        '&companyCode=' +
        btoa(detail.companyCode),
      '_blank'
    );
  }
}
