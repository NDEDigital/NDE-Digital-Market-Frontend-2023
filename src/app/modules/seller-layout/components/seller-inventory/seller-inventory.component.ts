import { Component, ElementRef } from '@angular/core';
import { SellerOrderOverviewService } from '../../../../services/SellerOrderOverviewService';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { TableHeadersService } from 'src/app/services/table-headers.service';
@Component({
  selector: 'app-seller-inventory',
  templateUrl: './seller-inventory.component.html',
  styleUrls: ['./seller-inventory.component.css'],
})
export class SellerInventoryComponent {
  SearchByname = 'GoodsName';
  placeholder = 'Search by';
  searchby = ' Goods Name';
  searchInputValue = '';
  inventoryData: any = [];
  filteredData: any = [];
  goodsName: string = '';
  groupCode: string = '';
  sellerId: any;
  isHovered: any | null = null;
  headers!: any;
  // Active group ID
  activeGroupId: number | null = null;
  /**
   * Constructor to inject dependencies.
   * @param elementRef Reference to the component's element in the DOM
   * @param SellerService Service for fetching seller order overview data
   */
  constructor(
    protected destroyRef: DestroyRef,
    private elementRef: ElementRef,
    private SellerService: SellerOrderOverviewService,
    private tableHeaders: TableHeadersService
  ) {}

  /**
   * Lifecycle hook called after component initialization.
   * Fetches inventory data.
   */
  ngOnInit() {
    this.getData();
    this.headers = this.tableHeaders.sellerInventoryTableHeaders;
  }

  /**
   * Sets the search option and resets search inputs.
   * @param option Search option to set
   */
  setSearchOption(option: string) {
    this.searchInputValue = '';
    this.SearchByname = option;
    this.searchby = option;
    this.placeholder = 'Search by';
    this.goodsName = '';
    this.groupCode = '';
    this.getData();
  }

  /**
   * Handles key up events in the search input.
   * Triggers search when Enter key is pressed or Backspace is pressed.
   * Resets filtered data when search input is empty.
   * @param event Keyboard event
   */
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === 'Backspace') {
      this.searchInputValue = this.searchInputValue.trim();
      this.search();
    }
    if (!this.searchInputValue) {
      this.filteredData = this.inventoryData;
    }
  }

  /**
   * Performs search based on current search option and input value.
   */
  search() {
    const searchValue = this.searchInputValue.trim();
    if (this.SearchByname === 'GroupCode') {
      this.filteredData = this.inventoryData.filter(
        (item: any) => item.productGroupName === searchValue
      );
    } else {
      this.filteredData = this.inventoryData.filter(
        (item: any) => item.productName === searchValue
      );
    }
  }

  /**
   * Handles click event on search icon.
   * Triggers search.
   */
  searchIcon() {
    this.search();
  }

  /**
   * Fetches inventory data for the current seller.
   * Uses sellerId stored in local storage.
   */
  getData() {
    this.sellerId = localStorage.getItem('code') || '';
    this.SellerService.getSellerInventory(this.sellerId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: any) => {
        this.inventoryData = data;
        this.filteredData = this.inventoryData;
      });
  }
}
