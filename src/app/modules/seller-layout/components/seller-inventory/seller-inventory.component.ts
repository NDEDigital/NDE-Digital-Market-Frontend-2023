import {
  Component,
  ElementRef,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
  DoCheck,
  OnInit,
} from '@angular/core';
import { SellerOrderOverviewService } from '../../../../services/SellerOrderOverviewService';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { TableHeadersService } from 'src/app/services/table-headers.service';

@Component({
  selector: 'app-seller-inventory',
  templateUrl: './seller-inventory.component.html',
  styleUrls: ['./seller-inventory.component.css'],
})
export class SellerInventoryComponent implements OnInit {
  SearchByname = 'GoodsName';
  placeholder = 'Search by';
  searchby = ' Goods Name';
  searchInputValue = '';
  inventoryData: any = [];
  filteredData!: any;
  goodsName: string = '';
  groupCode: string = '';
  sellerId: any;
  isHovered: any | null = null;
  headers!: any;
  activeGroupId: number | null = null;

  constructor(
    protected destroyRef: DestroyRef,
    private SellerService: SellerOrderOverviewService,
    private tableHeaders: TableHeadersService
  ) {}

  ngOnInit() {
    this.headers = this.tableHeaders.sellerInventoryTableHeaders;

    this.getData();
  }

  setSearchOption(option: string) {
    this.searchInputValue = '';
    this.SearchByname = option;
    this.searchby = option;
    this.placeholder = 'Search by';
    this.goodsName = '';
    this.groupCode = '';
    this.getData();
  }

  onKeyUp(event: any) {
    console.log(event.event);
    const searchValue = event.event.trim().toLowerCase();
    console.log(event.event);
    this.filteredData = this.inventoryData.filter((item: any) =>
      item.productName.toLowerCase().includes(searchValue)
    );
  }

  search(value: any) {
    const searchValue = value.trim().toLowerCase();
    console.log(value);
    this.filteredData = this.inventoryData.filter((item: any) =>
      item.productName.toLowerCase().includes(searchValue)
    );

    console.log(this.filteredData);
  }

  searchIcon() {
    this.search(event);
  }

  getData() {
    this.sellerId = localStorage.getItem('code') || '';
    this.SellerService.getSellerInventory(this.sellerId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: any) => {
        this.inventoryData = data;
        this.filteredData = data;
        // this.previousFilteredData = this.filteredData;
        // this.cdr.detectChanges();
      });
  }
}
