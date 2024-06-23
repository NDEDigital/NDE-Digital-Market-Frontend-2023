import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  selectedGroup: string = '';
  groupSelected: string = '';
  @Input() showCategory!: boolean;
  @Input() showCompany!: boolean;
  @Input() showGroup!: boolean;
  constructor(
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private goodsDataService: GoodsDataService,
    private companyService: CompanyService
  ) {
    this.loadCategory();

    this.activeEntry = localStorage.getItem('groupCodes');
  }

  ngOnInit(): void {
    console.log(this.groupData, 'AASSAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    console.log(this.activeEntry);
    console.log(this.activeCompany);

    this.loadBrand();
  }
  toggleGroupVisibility() {
    this.showGroupValue = !this.showGroupValue;
  }
  toggleCompaniesVisibility() {
    this.showCompaniesValue = !this.showCompaniesValue;
  }
  selectCompany(companyName: string, companyCode: string) {
    this.selectedCompanyName = companyCode;
    this.activeCompany = companyCode;
    let groupCode = this.activeEntry;
    console.log(this.activeEntry, 'Assscheee pore', this.activeCompany);
    this.companySelected.emit({ groupCode, companyCode });
  }

  setSelectData(groupCode: string, companyCode: string) {
    this.activeEntry = groupCode;
    console.log(this.activeEntry, 'ashcssssssssssssse');

    this.loadCompanyList.emit({ groupCode, companyCode });
  }

  setGroupData(groupCode: string, companyCode: string) {
    this.groupSelected = groupCode;
    console.log('Assscheee pore', this.companyCode);
    this.selectedCompanyName = '';
    this.activeEntry = groupCode;
    companyCode = '';
    this.activeCompany = '';
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
