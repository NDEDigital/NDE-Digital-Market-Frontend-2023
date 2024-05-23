// import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// import { NavigationEnd, Router } from '@angular/router';
// import { CompanyService } from 'src/app/services/company.service';
// import { GoodsDataService } from 'src/app/services/goods-data.service';
// import { SharedService } from 'src/app/services/shared.service';

// @Component({
//   selector: 'app-product-sidebar',
//   templateUrl: './product-sidebar.component.html',
//   styleUrls: ['./product-sidebar.component.css'],
// })
// export class ProductSidebarComponent implements OnInit {
//   goods: any;
//   groupData = new Map();
//   showAll = false; // Variable to toggle the view state
//   initialLimit = 5; // Number of items to show initially
//   // --------------
//   companyStatus: number = 1;
//   companyList: any;
//   showAllBrand = false;

//   // --------------------
//   isProductPage = false;
//   activeEntry: string = '';
//   @Output() dataUpdated = new EventEmitter<void>();
//   constructor(
//     private sharedService: SharedService,
//     private router: Router,
//     private goodsDataService: GoodsDataService,
//     private companyService: CompanyService
//   ) {}

//   ngOnInit(): void {
//     //  this.activeEntry = localStorage.getItem('activeEntry') || '';
//     //  this.router.events.subscribe((event) => {
//     //    if (event instanceof NavigationEnd) {
//     //      if (event.url === '/') {
//     //        localStorage.removeItem('activeEntry');
//     //      }
//     //    }
//     //  });
//     console.log('ngOnInit called');
//     this.detectProductPage(); // Call function to detect if it's the product page
//     console.log('isProductPage after detectProductPage:', this.isProductPage);
//     this.loadCategory();
//     if (!this.isProductPage) {
//       this.loadBrand();
//     }
//   }
//   detectProductPage(): void {
//     this.router.events.subscribe((event) => {
//       if (event instanceof NavigationEnd) {
//         console.log('NavigationEnd event occurred:', event.url);
//         this.isProductPage = event.url === '/productsPageComponent';
//         console.log('isProductPage:', this.isProductPage);
//       }
//     });
//   }

//   // detectProductPage(): void {
//   //   this.router.events.subscribe((event) => {
//   //     if (event instanceof NavigationEnd) {
//   //       // Extract the base URL without query parameters
//   //       const baseUrl = event.url.split('?')[0];
//   //       // Compare the base URL with the route path of the products page
//   //       this.isProductPage = baseUrl === '/productsPageComponent';
//   //     }
//   //   });
//   // }

//   setSelectData(groupCode: string, groupName: string) {
//     this.sharedService.setNavSelectData(groupCode, groupName);

//     this.dataUpdated.emit();
//     // Update active entry
//     this.activeEntry = groupName;

//     localStorage.setItem('activeEntry', this.activeEntry);
//     this.router.navigate(['/productsPageComponent'], {
//       queryParams: { groupCode: btoa(groupCode) },
//     });
//   }

//   loadCategory(): void {
//     this.goodsDataService.getNavData().subscribe((data: any[]) => {
//       this.goods = data;
//       for (let i = 0; i < this.goods.length; i++) {
//         this.groupData.set(
//           this.goods[i].productGroupCode,
//           this.goods[i].productGroupName
//         );
//       }
//     });
//   }
//   loadBrand(): void {
//     this.companyService
//       .GetCompaniesBasedOnStatus(this.companyStatus)
//       .subscribe({
//         next: (response: any) => {
//           this.companyList = response;
//           console.log(this.companyList, ' li lisaa');
//         },
//         error: (error: any) => {},
//       });
//   }
// }
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
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
  activeEntry: string = '';
  @Output() dataUpdated = new EventEmitter<void>();

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private goodsDataService: GoodsDataService,
    private companyService: CompanyService
  ) {
    this.detectProductPage();
  }

  ngOnInit(): void {
    this.detectProductPage();
    this.loadCategory();
    if (!this.isProductPage) {
      this.loadBrand();
    }
  }

  detectProductPage(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isProductPage = event.url.includes('/productsPageComponent');
        if (this.isProductPage) {
          this.route.queryParams.subscribe((params) => {
            if (params['groupCode']) {
              const groupCode = atob(params['groupCode']);
              this.activeEntry = this.groupData.get(groupCode) || '';
            }
          });
        }
      }
    });
  }

  setSelectData(groupCode: string, groupName: string) {
    this.sharedService.setNavSelectData(groupCode, groupName);
    this.dataUpdated.emit();
    this.activeEntry = groupName;
    localStorage.setItem('activeEntry', this.activeEntry);
    this.router.navigate(['/productsPageComponent'], {
      queryParams: { groupCode: btoa(groupCode) },
    });
  }

  loadCategory(): void {
    this.goodsDataService.getNavData().subscribe((data: any[]) => {
      this.goods = data;
      for (let i = 0; i < this.goods.length; i++) {
        this.groupData.set(
          this.goods[i].productGroupCode,
          this.goods[i].productGroupName
        );
      }
      // Check if there's an active entry in the query params
      const activeGroupCode =
        this.route.snapshot.queryParamMap.get('groupCode');
      if (activeGroupCode) {
        const decodedGroupCode = atob(activeGroupCode);
        this.activeEntry = this.groupData.get(decodedGroupCode) || '';
      }
    });
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
