import { Component, ElementRef, ViewChild } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { SellerDasboardPermissionService } from 'src/app/services/seller-dasboard-permission.service';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
@Component({
  selector: 'app-seller-permission',
  templateUrl: './seller-permission.component.html',
  styleUrls: ['./seller-permission.component.css'],
})
export class SellerPermissionComponent {
  selectedValue: any;
  dropdownValues: any[] = [];
  tableData: any[] = [];
  isHovered: any | null = null;
  whoUser: any;
  UserId: any;
  sellerList: any;
  responseLength: any;
  selectedUserId: any;
  selectedMenu: any;
  selectedMenuItems: any = [];
  user: any = [];
  currentIndex: number = 0;
  @ViewChild('sellerSelected') sellerSelected!: ElementRef;
  @ViewChild('menuSelected') menuSelected!: ElementRef;
  @ViewChild('msgModalBTN') modalButton!: ElementRef;
  @ViewChild('yesButton') yesButton!: ElementRef;

  constructor(
    protected destroyRef: DestroyRef,
    private companyService: CompanyService,
    private SellerDasboardPermissionService: SellerDasboardPermissionService
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  ngOnInit() {
    this.UserId = localStorage.getItem('code');
    this.whoUser = localStorage.getItem('role');

    if (this.whoUser === 'seller') {
      this.getPermission();
      this.getData();
    }
  }

  /**
   * Fetches dashboard items for a specific seller.
   * @param sellerId - ID of the seller.
   */
  getDashboarItem(sellerId: any) {
    this.SellerDasboardPermissionService.GetSellerDashboardPermission(sellerId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => this.handleGetDashboardItemSuccess(response),
        error: (error: any) => this.handleError(error),
      });
  }

  /**
   * Handles the success response for fetching dashboard items.
   * @param response - Response from the server.
   */
  handleGetDashboardItemSuccess(response: any) {
    this.dropdownValues = response;
  }

  /**
   * Fetches the list of sellers.
   */
  getData() {
    this.companyService
      .GetSellerList(1)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => this.handleGetDataSuccess(response),
        error: (error: any) => this.handleError(error),
      });
  }

  /**
   * Handles the success response for fetching the list of sellers.
   * @param response - Response from the server.
   */
  handleGetDataSuccess(response: any) {
    this.sellerList = response.filter(
      (u: any) => u.userId !== Number(this.UserId)
    );
    console.log(this.sellerList);
  }

  /**
   * Called when the user selection changes.
   * @param userId1 - Selected user ID.
   */
  onUserChange(userId1: any) {
    this.getDashboarItem(userId1);
  }

  /**
   * Handles the button click event to grant permissions.
   * @param userId2 - User ID.
   * @param MenuId - Menu ID.
   */
  PermissionBtn(userId2: any, MenuId: any) {
    if (this.validatePermissionInput(userId2, MenuId)) {
      this.SellerDasboardPermissionService.GivePermissionToDash(userId2, MenuId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response: any) =>
            this.handlePermissionSuccess(response, MenuId),
          error: (error: any) => this.handleError(error),
        });
    }
  }

  /**
   * Validates the input for granting permissions.
   * @param userId2 - User ID.
   * @param MenuId - Menu ID.
   * @returns - Boolean indicating if the input is valid.
   */
  validatePermissionInput(userId2: any, MenuId: any): boolean {
    if (userId2 === 'null' || MenuId === 'null') {
      alert(
        'Please select both Seller Name and Menu Name before adding permission.'
      );
      return false;
    }
    return true;
  }

  /**
   * Handles the success response for granting permissions.
   * @param response - Response from the server.
   * @param MenuId - Menu ID.
   */
  handlePermissionSuccess(response: any, MenuId: any) {
    this.getPermission();
    this.menuSelected.nativeElement.value = null;
    MenuId = MenuId;
    this.dropdownValues = this.dropdownValues.filter(
      (user) => MenuId !== user.menuId
    );
  }
  /**
   * Updates the current index for table data.
   */
  updateTableData() {
    this.currentIndex++;
  }
  /**
   * Fetches the permissions for the current user.
   */
  getPermission() {
    this.SellerDasboardPermissionService.GetPermissionData(this.UserId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => this.handleGetPermissionSuccess(response),
        error: (error: any) => this.handleError(error),
      });
  }

  /**
   * Handles the success response for fetching permissions.
   * @param response - Response from the server.
   */
  handleGetPermissionSuccess(response: any) {
    this.tableData = response;
  }
  /**
   * Handles the change event of the checkbox.
   * @param userId - User ID.
   * @param menuId - Menu ID.
   */
  checkboxChanged(userId: any, menuId: any) {
    this.deselectOtherUsers(userId);
    this.updateSelectedMenuItems(userId);
  }

  /**
   * Deselects checkboxes for other users.
   * @param userId - User ID.
   */
  deselectOtherUsers(userId: any) {
    for (const key in this.tableData) {
      if (key !== userId) {
        const otherUser = this.tableData[key];
        for (const item of otherUser) {
          item.isSelected = false;
        }
      }
    }
  }

  /**
   * Updates the selected menu items for a specific user.
   * @param userId - User ID.
   */
  updateSelectedMenuItems(userId: any) {
    const user = this.tableData[userId];
    this.selectedMenuItems = user.filter(
      (menuItem: any) => menuItem.isSelected
    );
  }
  /**
   * Opens the modal if there are selected menu items.
   */
  openModal() {
    if (this.selectedMenuItems.length > 0 && this.modalButton) {
      this.modalButton.nativeElement.click();
    }
  }
  /**
   * Handles the yes button click event to update permissions.
   * @param sellerSelected - Selected seller.
   */
  yesBtn(sellerSelected: any) {
    this.UpdatePermission(sellerSelected);
  }

  /**
   * Updates the permissions for the selected seller.
   * @param selectedSeller - Selected seller.
   */

  UpdatePermission(selectedSeller: any) {
    if (!this.validateUpdatePermissionInput()) {
      return;
    }

    const menuIds: number[] = this.selectedMenuItems.map(
      (item: any) => item.menuId
    );

    if (!this.selectedMenuItems[0].userId) {
      alert('No userName in selected menu items');
      return;
    }

    this.closeModal();
    console.log(menuIds);
    this.SellerDasboardPermissionService.DeleteMenuId(
      this.selectedMenuItems[0].userId,
      menuIds
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) =>
          this.handleUpdatePermissionSuccess(response, selectedSeller),
        error: (error: any) => this.handleError(error),
      });
  }

  /**
   * Validates the input for updating permissions.
   * @returns - Boolean indicating if the input is valid.
   */
  validateUpdatePermissionInput(): boolean {
    if (!this.selectedMenuItems || this.selectedMenuItems.length === 0) {
      alert('No Item is selected menu items');
      return false;
    }
    return true;
  }

  /**
   * Closes the modal.
   */
  closeModal() {
    if (this.modalButton) {
      this.modalButton.nativeElement.click();
    }
  }

  /**
   * Handles the success response for updating permissions.
   * @param response - Response from the server.
   * @param selectedSeller - Selected seller.
   */
  handleUpdatePermissionSuccess(response: any, selectedSeller: any) {
    this.getPermission();
    this.menuSelected.nativeElement.value = null;
    this.selectedMenuItems.length = 0;
    this.getDashboarItem(selectedSeller);
  }

  /**
   * Handles errors from HTTP requests.
   * @param error - Error response.
   */
  handleError(error: any) {
    console.log(error);
  }

  /**
   * Handles the yes button click event.
   */
  onYesButtonClick() {
    alert('Yes button clicked');
  }
}
