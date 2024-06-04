import { Component, ElementRef, Input, Output, ViewChild } from '@angular/core';
import { reload } from 'firebase/auth';

import { CompanyService } from 'src/app/services/company.service';
import { EmailService } from 'src/app/services/email.service';
import { TableHeadersService } from 'src/app/services/table-headers.service';

import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-seller-list',
  templateUrl: './seller-list.component.html',
  styleUrls: ['./seller-list.component.css'],
})
export class SellerListComponent {
  isHovered: any | null = null;
  headers!: string[];
  buyerResponse: any;
  responseLength: any;
  dropdownValues: any[] = [];
  dropdownValuesWithNames: any[] = [];
  userBtnIndex = 0;
  btnIndex = 1;
  sellerList: any;
  whoUser: any;
  imagePath = '';
  imageTitle = 'No Data Found!';
  selectedCompanyCodeValues: { [key: string]: any } = {};
  UserId: any;
  @ViewChild('msgModalBTN') msgModalBTN!: ElementRef;
  @ViewChild('allselected', { static: true })
  allSelectedCheckbox!: ElementRef<HTMLInputElement>;

  alertTitle: string = '';
  alertMsg: string = '';
  selectedValue: any;

  selectedProductIds: any[] = [];
  selectedProducts1: any[] = [];
  selectAll = false;
  constructor(
    protected destroyRef: DestroyRef,
    private companyService: CompanyService,
    private tableHeadersService: TableHeadersService
  ) {}
  /**
   * Initializes the component and sets up initial state.
   */
  ngOnInit() {
    this.UserId = localStorage.getItem('code');
    this.whoUser = localStorage.getItem('role');
    this.initializeComponent();
  }
  /**
   * Sets up the component based on the user's role.
   */
  initializeComponent() {
    if (this.whoUser === 'seller') {
      this.getData();
    } else {
      this.getSeller();
    }
    this.getDropdownValues();
    this.headers = this.tableHeadersService.userListTableHeaders;
  }
  /**
   * Fetches the list of sellers for the seller role.
   */
  getData() {
    this.companyService
      .GetSellerList(this.btnIndex)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.sellerList = response.filter(
            (u: any) => u.userId !== Number(this.UserId)
          );
          this.responseLength = response.length;
        },
        error: this.handleError,
      });
  }
  /**
   * Handles the category change event and fetches the seller list based on the selected category.
   * @param event The event object from the category change.
   */
  onCategoryChange(event: any): void {
    this.selectedValue = event.target.value;
    this.getSeller();
  }
  /**
   * Fetches the list of sellers for the admin role.
   */
  getSeller(): void {
    this.resetSelection();
    console.log(this.selectedValue, 'ashce');
    this.companyService
      .GetSellerInAdmin(this.btnIndex, this.selectedValue)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.sellerList = response;
          this.responseLength = response.length;
          console.log('kire', this.sellerList);
        },
        error: this.handleError,
      });
  }
  /**
   * Fetches the dropdown values for the company codes.
   */
  getDropdownValues(): void {
    this.companyService
      .GetDropdownValues()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.dropdownValues = this.getUniqueCompanyCodes(response);
        },
        error: this.handleError,
      });
  }
  /**
   * Filters the dropdown values to get unique company codes.
   * @param response The response array containing company codes.
   * @returns An array of unique company codes.
   */
  getUniqueCompanyCodes(response: any[]): any[] {
    const uniqueCompanyCodesMap = new Map<string, any>();
    response.forEach((item: any) => {
      if (!uniqueCompanyCodesMap.has(item.companyCode)) {
        uniqueCompanyCodesMap.set(item.companyCode, item);
      }
    });
    return Array.from(uniqueCompanyCodesMap.values());
  }
  /**
   * Fetches the list of buyers for the admin role.
   */
  getBuyer() {
    this.resetSelection();
    this.companyService
      .GetBuyerInAdmin(this.btnIndex)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.buyerResponse = response.length;
          this.sellerList = response;
        },
        error: this.handleError,
      });
  }
  /**
   * Determines whether to fetch the buyer or seller list based on the user button index.
   */
  getUser() {
    if (this.userBtnIndex === 1) {
      this.getBuyerIn();
    } else {
      this.getSellerIn();
    }
  }
  /**
   * Fetches the buyer list and updates the dropdown values.
   */
  getBuyerIn() {
    this.getDropdownValues();
    this.getBuyer();
  }
  /**
   * Fetches the seller list.
   */
  getSellerIn() {
    this.getSeller();
  }
  /**
   * Updates the active/inactive status of a seller or buyer.
   * @param userId The user ID of the seller or buyer.
   * @param status The new status to be set.
   */
  UpdatedSellerBuyer(userId: any, status: any) {
    userId = userId.toString();
    this.companyService
      .UpdateSellerActiveInActive(userId, status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.showAlertMessage();
          if (this.whoUser === 'seller') {
            this.getData();
          } else {
            this.getUser();
          }
        },
        error: this.handleError,
      });
  }
  /**
   * Toggles the selection of all checkboxes.
   */
  toggleAllCheckboxes() {
    this.sellerList.forEach((product: { isSelected: boolean; userId: any }) => {
      product.isSelected = this.selectAll;
      this.updateSelectedProducts(product);
    });
  }
  /**
   * Updates the list of selected products based on the current selection state.
   * @param product The product object containing selection state and user ID.
   */
  updateSelectedProducts(product: { isSelected: boolean; userId: any }) {
    if (this.selectAll && !this.selectedProducts1.includes(product.userId)) {
      this.selectedProducts1.push(product.userId);
    } else if (
      !this.selectAll &&
      this.selectedProducts1.includes(product.userId)
    ) {
      this.selectedProducts1 = this.selectedProducts1.filter(
        (id) => id !== product.userId
      );
      this.selectAll = false;
    }
  }
  /**
   * Changes the active/inactive status of selected sellers or buyers.
   * @param isActive The new status to be set.
   */
  chageActiveInactive(isActive: any) {
    if (this.selectedProducts1.length > 0) {
      this.companyService
        .UpdateSellerActiveInActive(this.selectedProducts1.toString(), isActive)
        .subscribe({
          next: (response: any) => {
            this.showAlertMessage();
            this.refreshData();
          },
          error: (error: any) => {
            this.alertMsg = error.error.message;
          },
        });
    } else {
      this.showNoSelectionAlert();
    }
  }
  /**
   * Displays an alert message based on the current button indices and user button indices.
   */
  showAlertMessage() {
    if (this.btnIndex === 1 && this.userBtnIndex === 1) {
      this.alertTitle = 'Buyer Deactivation!';
      this.alertMsg = 'Buyer is Deactivated Successfully.';
    } else if (this.btnIndex === 1 && this.userBtnIndex === 0) {
      this.alertTitle = 'Seller Deactivation!';
      this.alertMsg = 'Seller is Deactivated Successfully.';
    } else if (this.btnIndex === 0 && this.userBtnIndex === 1) {
      this.alertTitle = 'Buyer Activation!';
      this.alertMsg = 'Buyer is Activated Successfully.';
    } else {
      this.alertTitle = 'Seller Activation!';
      this.alertMsg = 'Seller is Activated Successfully.';
    }
    this.msgModalBTN.nativeElement.click();
  }
  /**
   * Refreshes the data by fetching the appropriate list based on the user's role.
   */
  refreshData() {
    if (this.whoUser === 'seller') {
      this.getData();
    } else {
      this.getUser();
    }
    this.selectAll = false;
    this.selectedProducts1.length = 0;
  }
  /**
   * Displays an alert message indicating no selection was made.
   */
  showNoSelectionAlert() {
    this.msgModalBTN.nativeElement.click();
    this.alertTitle = 'No Activation!';
    this.alertMsg = 'User not selected';
  }
  /**
   * Handles the selection of a checkbox for a specific user.
   * @param userId The user ID of the selected user.
   * @param event The event object from the checkbox change.
   */
  checkboxSelected(userId: any, event: any) {
    const isSelected: boolean = event.target.checked;
    this.updateCheckboxSelection(userId, isSelected);
  }
  /**
   * Updates the selection state of a user in the selected products list.
   * @param userId The user ID of the selected user.
   * @param isSelected The selection state of the checkbox.
   */
  updateCheckboxSelection(userId: any, isSelected: boolean) {
    if (isSelected && !this.selectedProducts1.includes(userId)) {
      this.selectedProducts1.push(userId);
    } else if (!isSelected && this.selectedProducts1.includes(userId)) {
      this.selectedProducts1 = this.selectedProducts1.filter(
        (id) => id !== userId
      );
    }
    this.allSelectedCheckbox.nativeElement.checked =
      this.selectedProducts1.length === this.sellerList.length;
    this.selectedProductIds = this.selectedProducts1.slice();
  }
  /**
   * Resets the selection state of all checkboxes.
   */
  resetSelection() {
    this.allSelectedCheckbox.nativeElement.checked = false;
    this.selectedProducts1.length = 0;
    this.selectAll = false;
  }
  /**
   * Handles errors by logging them to the console.
   * @param error The error object.
   */
  handleError(error: any) {
    console.error(error);
  }
}
