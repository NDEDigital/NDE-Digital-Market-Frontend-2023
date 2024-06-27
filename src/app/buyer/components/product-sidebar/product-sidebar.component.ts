import { HttpErrorResponse } from '@angular/common/http';
import { Component,HostListener, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  showCompaniesValue = true;
  activeEntry: any = '';
  activeCompany: string = '';
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
  @Input() showCategory!: boolean;
  @Input() showCompany!: boolean;
  @Input() showGroup!: boolean;
  @Input() sidebar!: boolean;
  constructor(
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private goodsDataService: GoodsDataService,
    private companyService: CompanyService
  ) {
    this.loadCategory();

    this.activeEntry = localStorage.getItem('groupCode');

    this.filterContent = [];
    this.filterData();
  }

  ngOnInit(): void {
    console.log(this.groupData, 'AASSAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    console.log(this.activeEntry);
    console.log(this.activeCompany);

    this.loadBrand();
    this.filterContent = [];
    this.filterData();
    this.checkWindowWidth();
  }
  toggleGroupVisibility() {
    this.showGroupValue = !this.showGroupValue;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWindowWidth();
  }

  checkWindowWidth() {
    if (window.innerWidth > 768) {
      this.setGroupData('','')
    }
    // if (window.innerWidth > 768) {
    //   this.notfilter = true;
    // }
    // if (window.innerWidth < 768) {
    //   this.notfilter = false;
    // }
  }
  toggleCompaniesVisibility() {
    this.showCompaniesValue = !this.showCompaniesValue;
  }
  filterData() {
    if (this.activeEntry) this.filterContent.push('Category');
    if (this.activeCompany) this.filterContent.push('Company');
    if (!this.activeEntry && !this.activeCompany) {
      this.clear = false;
    } else {
      this.clear = true;
    }
  }
  removeFilterContent(item: string) {
    if (item == 'all') {
      this.activeCompany = '';
      this.activeEntry = '';
      this.filterContent = [];
      this.setGroupData(this.activeEntry, this.activeCompany);
    }
    if (item == 'Company') {
      this.activeCompany = '';
      this.setGroupData(this.activeEntry, this.activeCompany);
    } else if (item == 'Category') {
      this.activeEntry = '';
      this.selectCompany(this.activeEntry, this.activeCompany);
    }
    const index = this.filterContent.indexOf(item);
    if (index > -1) {
      this.filterContent.splice(index, 1);
    }
    if (!this.activeEntry && !this.activeCompany) {
      this.clear = false;
    } else {
      this.clear = true;
    }
  }
  selectCompany(companyName: string, companyCode: string) {
    this.selectedCompanyName = companyCode;
    this.activeCompany = companyCode;
    let groupCode = this.activeEntry;
    this.filterContent = [];
    this.filterData();
    console.log(this.activeEntry, 'Assscheee pore', this.activeCompany);
    this.companySelected.emit({ groupCode, companyCode });
  }

  setSelectData(groupCode: string, companyCode: string) {
    this.activeEntry = groupCode;
    console.log(this.activeEntry, 'ashcssssssssssssse');
    this.filterContent = [];
    this.filterData();
    this.loadCompanyList.emit({ groupCode, companyCode });
  }

  setGroupData(groupCode: string, companyCode: string) {
    this.groupSelected = groupCode;
    console.log('Assscheee pore', this.companyCode);
    this.selectedCompanyName = '';
    this.activeEntry = groupCode;
    companyCode = this.activeCompany;

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
