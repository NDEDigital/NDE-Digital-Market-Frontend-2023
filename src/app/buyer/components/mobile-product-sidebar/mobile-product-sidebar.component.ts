import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  HostListener,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { CompanyService } from 'src/app/services/company.service';
import { GoodsDataService } from 'src/app/services/goods-data.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-mobile-product-sidebar',
  templateUrl: './mobile-product-sidebar.component.html',
  styleUrls: ['./mobile-product-sidebar.component.css'],
})
export class MobileProductSidebarComponent {
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
  showCompaniesValue = true;
  activeEntry1: any = '';
  activeCompany1: string = '';
  active: string = '';
  @Output() dataUpdated = new EventEmitter<void>();
  @Output() companyNameChanged = new EventEmitter<string>();
  selectedCompanyName: string = ''; // Add this variable to store selected company name
  @Output() loadCompanyList = new EventEmitter<{
    groupCode: string;
    companyCode: string;
  }>();

  @Output() getAllProduct = new EventEmitter<{
    groupCode: string;
    companyCode: string;
  }>();
  @Output() companySelected = new EventEmitter<{
    groupCode: string;
    companyCode: string;
  }>();
  // -----------------
  products: string[] = [];
  product8 = new Map();
  selectedProductCode: string = '';

  products3 = new Map();
  getTopSellerData: any;
  groupCode: string = '';
  groupCodePa: string = '';
  showGroupValue = true;
  groupName: string = '';

  productId: string = '';
  companyCode: string = '';

  filteredProducts: any[] = [];
  filteredCompanyList: any[] = [];
  filterContent: any[] = [];
  selectedGroup: string = '';
  groupSelected: string = '';
  clear = true;
  @Input() showCategory1!: boolean;
  @Input() showCompany1!: boolean;
  @Input() showGroup1!: boolean;
  constructor(
    private goodsDataService: GoodsDataService,
    private companyService: CompanyService
  ) {
    this.loadCategory();
    this.activeEntry1 = localStorage.getItem('groupCode');
    this.filterContent = [];
    this.filterData();
    this.checkWindowWidth();
  }

  ngOnInit(): void {
    console.log(this.groupData, 'AASSAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    console.log(this.activeEntry1);
    console.log(this.activeCompany1);

    this.loadBrand();
    this.filterContent = [];
    this.filterData();
  }
  toggleGroupVisibility() {
    this.showGroupValue = !this.showGroupValue;
  }
  toggleCompaniesVisibility() {
    this.showCompaniesValue = !this.showCompaniesValue;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWindowWidth();
  }

  checkWindowWidth() {
    if (window.innerWidth < 768) {
      this.setGroupData('', '');
    }
    // if (window.innerWidth > 768) {
    //   this.notfilter = true;
    // }
    // if (window.innerWidth < 768) {
    //   this.notfilter = false;
    // }
  }
  filterData() {
    if (this.activeEntry1) this.filterContent.push('Category');
    if (this.activeCompany1) this.filterContent.push('Company');
    if (!this.activeEntry1 && !this.activeCompany1) {
      this.clear = false;
    } else {
      this.clear = true;
    }
  }
  removeFilterContent(item: string) {
    if (item == 'all') {
      this.activeCompany1 = '';
      this.activeEntry1 = '';
      this.filterContent = [];
      this.setGroupData(this.activeEntry1, this.activeCompany1);
    }
    if (item == 'Company') {
      this.activeCompany1 = '';
      this.setGroupData(this.activeEntry1, this.activeCompany1);
    } else if (item == 'Category') {
      this.activeEntry1 = '';
      this.selectCompany(this.activeEntry1, this.activeCompany1);
    }
    const index = this.filterContent.indexOf(item);
    if (index > -1) {
      this.filterContent.splice(index, 1);
    }
    if (!this.activeEntry1 && !this.activeCompany1) {
      this.clear = false;
    } else {
      this.clear = true;
    }
  }
  selectCompany(companyName: string, companyCode: string) {
    this.selectedCompanyName = companyCode;
    this.activeCompany1 = companyCode;
    let groupCode = this.activeEntry1;
    this.filterContent = [];
    this.filterData();
    console.log(this.activeEntry1, 'Assscheee pore', this.activeCompany1);
    this.companySelected.emit({ groupCode, companyCode });
  }

  setSelectData(groupCode: string, companyCode: string) {
    this.activeEntry1 = groupCode;
    console.log(this.activeEntry1, 'ashcssssssssssssse');
    this.filterContent = [];
    this.filterData();
    this.loadCompanyList.emit({ groupCode, companyCode });
  }

  setGroupData(groupCode: string, companyCode: string) {
    this.groupSelected = groupCode;
    console.log('Assscheee pore', this.companyCode);
    this.selectedCompanyName = '';
    this.activeEntry1 = groupCode;
    companyCode = this.activeCompany1;

    this.filterContent = [];
    this.filterData();
    console.log(groupCode, 'GROUP DTAAAA');
    this.getAllProduct.emit({ groupCode, companyCode });
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

          console.log('Company Dataaaaaaa:', this.companyData); // Log the company data
        },
        error: (error: any) => {
          console.error('Error loading company list:', error);
        },
      });
  }
}
