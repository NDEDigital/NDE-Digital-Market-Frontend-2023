import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { CompanyService } from 'src/app/services/company.service';
import { GoodsDataService } from 'src/app/services/goods-data.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-product-sidebar',
  templateUrl: './product-sidebar.component.html',
  styleUrls: ['./product-sidebar.component.css'],
})
export class ProductSidebarComponent implements OnInit {
  goods: any;
  groupData = new Map();
  showAll = false; // Variable to toggle the view state
  initialLimit = 5; // Number of items to show initially
  companyStatus: number = 1;
  companyList: any;
  showAllBrand = false;
  isProductPage = false;
  isGroupProductPage = false;
  activeEntry: string = '';
  @Output() dataUpdated = new EventEmitter<void>();
  // -----------------
  products: string[] = [];
  product8 = new Map();
  selectedProductCode: string = '';

  products3 = new Map();
  getTopSellerData: any;
  groupCode: string = '';
  groupCodePa: string = '';

  groupName: string = '';

  productId: string = '';
  companyCode: string = '';

  filteredProducts: any[] = [];

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private goodsDataService: GoodsDataService,
    private companyService: CompanyService
  ) {
    this.detectPage();
  }

  ngOnInit(): void {
    this.loadCategory();
    if (!this.isProductPage) {
      this.loadBrand();
    }
    const savedActiveEntry = localStorage.getItem('activeEntry');
    if (savedActiveEntry) {
      this.activeEntry = savedActiveEntry;
    }
  }

  detectPage(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isProductPage = event.url.includes('/productsPageComponent');
        this.isGroupProductPage = event.url.includes('/groupProducts');

        if (this.isProductPage) {
          this.route.queryParams.subscribe((params) => {
            if (params['groupCode']) {
              const groupCode = atob(params['groupCode']);
              this.activeEntry = this.groupData.get(groupCode) || '';
            }
          });
        } else if (this.isGroupProductPage) {
          this.route.queryParams.subscribe((params) => {
            if (params['groupName']) {
              const groupName = atob(params['groupName']);
              this.activeEntry = this.groupData.get(groupName) || '';
              this.filterProductsByCategory(groupName);
            }
          });
        }
      }
    });
  }
  filterProductsByCategory(groupName: string): void {
    this.filteredProducts = this.goods.filter(
      (product: any) => product.productGroupCode === groupName
    );
  }
  setSelectData(groupCode: string, groupName: string) {
    this.sharedService.setNavSelectData(groupCode, groupName);
    this.dataUpdated.emit();
    this.activeEntry = groupName;
    localStorage.setItem('activeEntry', this.activeEntry);
    if (this.isGroupProductPage) {
      this.filterProductsByCategory(groupName);
      this.router.navigate(['/groupProducts'], {
        queryParams: { groupCode: btoa(groupName) },
      });
    } else {
      this.router.navigate(['/productsPageComponent'], {
        queryParams: { groupCode: btoa(groupCode) },
      });
    }
  }

  loadCategory(): void {
    this.goodsDataService.getNavData().subscribe(
      (navData: any[]) => {
        this.goods = navData;
        for (let i = 0; i < this.goods.length; i++) {
          this.groupData.set(
            this.goods[i].productGroupCode,
            this.goods[i].productGroupName
          );
        }

        // Extract and decode the active group code from the query parameters
        const activeGroupCode =
          this.route.snapshot.queryParamMap.get('groupCode');
        if (activeGroupCode) {
          const decodedGroupCode = atob(activeGroupCode);
          this.activeEntry = this.groupData.get(decodedGroupCode) || '';
          this.filterProductsByCategory(decodedGroupCode);
        }
        // const activeGroupName =
        //   this.route.snapshot.queryParamMap.get('groupCode');
        // if (activeGroupName) {
        //   const decodedGroupName = atob(activeGroupName);
        //   this.activeEntry = this.groupData.get(decodedGroupName) || '';
        //   this.filterProductsByCategory(decodedGroupName);
        // }
      },
      (error: HttpErrorResponse) => {
        console.error('Error loading navigation data:', error);
      }
    );

    
  }

  loadBrand(): void {
    this.companyService
      .GetCompaniesBasedOnStatus(this.companyStatus)
      .subscribe({
        next: (response: any) => {
          this.companyList = response;
        },
        error: (error: any) => {
          console.error('Error loading company list:', error);
        },
      });
  }
}
