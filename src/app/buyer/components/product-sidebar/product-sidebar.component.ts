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
  companyData = new Map();
  showAll = false; // Variable to toggle the view state
  initialLimit = 5; // Number of items to show initially
  companyStatus: number = 1;
  companyList: any;
  showAllBrand = false;
  isProductPage = false;
  isGroupProductPage = false;
  isTopsellerpage = false;
  activeEntry: string = '';
  active: string = '';
  @Output() dataUpdated = new EventEmitter<void>();
  @Output() companyNameChanged = new EventEmitter<string>();
  selectedCompanyName: string = ''; // Add this variable to store selected company name

  @Output() companySelected = new EventEmitter<string>();
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
  filteredCompanyList: any[] = [];

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
      console.log('Active Entry from local storage:', this.activeEntry);
    }
   

    console.log('Group Data:', this.groupData); // Add this line-
  }

  selectCompany(companyName: string) {
    this.selectedCompanyName = companyName;
    this.companySelected.emit(this.selectedCompanyName); // Emit the selected company name
  }
  // Method to set active category based on query parameters


  detectPage(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isProductPage = event.url.includes('/productsPageComponent');
        this.isGroupProductPage = event.url.includes('/groupProducts');
        this.isTopsellerpage = event.url.includes('/ourTopSeller');
        console.log('Is Product Page:', this.isProductPage);
        console.log('Is Group Product Page:', this.isGroupProductPage); // Add this line


        if (this.isProductPage) {
          // Handle category filtering for product page if needed
        } 
        else if(this.isTopsellerpage){
           
        }
        
        else if (this.isGroupProductPage) {
          this.route.queryParams.subscribe((params) => {
            let groupCode, companyName;

            if (params['groupCode']) {
              groupCode = atob(params['groupCode']);
              this.activeEntry = this.groupData.get(groupCode) || '';

            }

           
          });
        }
      }
    });
  }

  filterProductsByCategory(groupName: string): void {
    // Filter products by category
    this.filteredProducts = this.goods.filter(
      (product: any) => product.productGroupCode === groupName
    );
  }

  filterProductsByBrands(companyName: string): void {
    // Filter products by brand
    this.filteredProducts = this.goods.filter(
      (product: any) => product.companyName === companyName
    );
  }

  filterProductsByCategoryAndBrand(
    groupCode: string,
    companyName: string
  ): void {
    // Filter products by both category and brand
    this.filteredProducts = this.goods.filter(
      (product: any) =>
        product.productGroupCode === groupCode &&
        product.companyName === companyName
    );
  }

  // filterBrandsByCategory(groupCode: string): void {
  //   // Filter brands by category
  //   const categoryProducts = this.goods.filter(
  //     (product: any) => product.productGroupCode === groupCode
  //   );
  //   const brandNames = new Set(
  //     categoryProducts.map((product: any) => product.companyName)
  //   );
  //   this.filteredCompanyList = this.companyList.filter((company: any) =>
  //     brandNames.has(company.companyName)
  //   );
  // }

  setSelectData(groupCode: string, groupName: string) {
    this.sharedService.setNavSelectData(groupCode, groupName);
    this.dataUpdated.emit();
    this.activeEntry = groupName; // Update activeEntry with the selected category or group name
    localStorage.setItem('activeEntry', this.activeEntry);
    if (this.isGroupProductPage) {
      this.filterProductsByCategory(groupName);
      // this.filterBrandsByCategory(groupName);
      this.router.navigate(['/groupProducts'], {
        queryParams: { groupCode: btoa(groupName) },
        
      });

    
    } else if(this.isTopsellerpage){

    this.router.navigate(['/ourTopSeller'],{
      queryParams: {groupCode: btoa(groupCode)}
    });
    } 

    
    
    else {
      this.router.navigate(['/productsPageComponent'], {
        queryParams: { groupCode: btoa(groupCode) },
      });
    }
  }

  setSelectBrand(companyName: string, groupName: string): void {
    this.sharedService.setGroupProduct(companyName, groupName);
    this.dataUpdated.emit();
    this.activeEntry = this.companyData.get(companyName) || '';
    localStorage.setItem('activeEntry', this.activeEntry);

    if (this.isGroupProductPage) {
      // this.filterProductsByCategoryAndBrand(this.groupCode, companyName);
      this.router.navigate(['/groupProducts']);

      // Emit companyName to the parent component
      this.companyNameChanged.emit(companyName);
    } else if (this.isTopsellerpage) {
      this.router.navigate(['/ourTopSeller']);
       this.companyNameChanged.emit(companyName);
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
          // this.filterBrandsByCategory(decodedGroupCode);
        }

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
          for (let i = 0; i < this.companyList.length; i++) {
            this.companyData.set(
              this.companyList[i].companyCode,
              this.companyList[i].companyName
            );
          }
          const activeCompanyName =
            this.route.snapshot.queryParamMap.get('companyName');
          if (activeCompanyName) {
            const decodedCompanyName = atob(activeCompanyName);
            this.activeEntry = this.groupData.get(decodedCompanyName) || '';
            this.filterProductsByBrands(decodedCompanyName);
          }

          console.log('Company Data:', this.companyData); // Log the company data
        },

        error: (error: any) => {
          console.error('Error loading company list:', error);
        },
      });
  }
}
