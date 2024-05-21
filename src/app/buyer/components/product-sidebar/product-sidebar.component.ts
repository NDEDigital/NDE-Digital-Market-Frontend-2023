import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
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
  // --------------
  companyStatus: number = 1;
  companyList: any;
  showAllBrand = false;

  // --------------------

  activeEntry: string = '';
  @Output() dataUpdated = new EventEmitter<void>();
  constructor(
    private sharedService: SharedService,
    private router: Router,
    private goodsDataService: GoodsDataService,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.loadCategory();
    this.loadBrand();
  }

  setSelectData(groupCode: string, groupName: string) {
    this.sharedService.setNavSelectData(groupCode, groupName);

    this.dataUpdated.emit();
    // Update active entry
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
    });
  }
  loadBrand(): void {
    this.companyService
      .GetCompaniesBasedOnStatus(this.companyStatus)
      .subscribe({
        next: (response: any) => {
          this.companyList = response;
          console.log(this.companyList, ' li lisaa');
        },
        error: (error: any) => {},
      });
  }
}
