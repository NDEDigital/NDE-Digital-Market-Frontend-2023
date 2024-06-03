import { ElementRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { AddProductService } from 'src/app/services/add-product.service';

export class AddGroupsBase {
  // Array to store selected products
  selectedProducts1: any[] = [];
  // Alert message
  alertMsg = '';
  // Flag for indicating error state
  isError = false;
  // Currently selected group
  currentGroup: any = null;

  // Index for button
  btnIndex = -1;
  // ViewChild references to various HTML elements
  allSelectedCheckbox!: ElementRef<HTMLInputElement>;

  // Array to hold the list of product groups
  groupList: any[] = [];
  // Flag for selecting all products
  selectAll = false;
  // Flag for edit mode
  isEditMode = false;
  constructor(
    protected addProductService: AddProductService,
    protected destroyRef: DestroyRef
  ) {}

  /**
   * Retrieves product groups based on status.
   * @param status Status of the product groups to retrieve
   */
  getProductGroup(status: number): void {
    this.btnIndex = status;
    if (this.allSelectedCheckbox) {
      this.allSelectedCheckbox.nativeElement.checked = false;
    }
    this.selectedProducts1.length = 0;
    this.selectAll = false;

    this.addProductService
      .GetProductGroupsListByStatus(status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.groupList = response;
        },
        error: (error: any) => {
          this.handleErrorResponse(error);
        },
      });
  }

  /**
   * Updates an existing product group.
   * @param formData Form data for updating the group
   */
  updateProductGroup(formData: any): void {
    const updateByUser = localStorage.getItem('code') || 'Unknown';
    formData.append('ProductGroupID', this.currentGroup.productGroupID);
    formData.append('UpdatedBy', updateByUser);
    formData.append('UpdatedPC', '0.0.0.0');

    this.addProductService
      .updateProductGroup(formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.alertMsg = 'Product group updated successfully';
          this.isEditMode = false;
          setTimeout(() => {
            this.showModalAndResetForm();
          }, 50);
          this.getProductGroup(-1);
        },
        error: (error: any) => {
          this.handleErrorResponse(error);
        },
      });
  }

  /**
   * Updates the status of selected product groups.
   * @param isActive Flag indicating whether to activate or deactivate
   */
  updateProductGroupStatus(isActive: number): void {
    console.log('just checking', this.selectedProducts1.toString());
    this.addProductService
      .updateProductGroupStatus(
        encodeURIComponent(this.selectedProducts1.toString()),
        isActive
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          const newStatus = isActive ? 1 : 0;
          this.getProductGroup(newStatus);
          this.showAlertAndResetForm(newStatus);
          this.selectAll = false;
          this.selectedProducts1.length = 0;
          this.showModalAndResetForm();
        },
        error: (error: any) => {
          this.handleErrorResponse(error);
        },
      });
  }
  /**
   * Updates the active status of a product group.
   * @param event Event containing isActive flag and product group ID
   */
  updateIsActive(event: { isActive: any; productGroupId: number }): void {
    this.addProductService
      .updateProductGroupStatus(event.productGroupId.toString(), event.isActive)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          const newStatus = event.isActive ? 1 : 0;
          this.getProductGroup(newStatus);
          this.showAlertAndResetForm(newStatus);
          this.showModalAndResetForm();
        },
        error: (error: any) => {
          this.handleErrorResponse(error);
        },
      });
  }

  /**
   * Creates a new product group.
   * @param formData Form data for creating the group
   */
  createProductGroup(formData: any): void {
    this.addProductService
      .createProductGroup(formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.alertMsg = response.message;
          this.isError = false;
          setTimeout(() => {
            this.showModalAndResetForm();
          }, 50);
          this.getProductGroup(-1);
        },
        error: (error: any) => {
          this.handleErrorResponse(error);
        },
      });
  }
  showAlertAndResetForm(newStatus: number): void {
    // Implement in derived class
  }

  showModalAndResetForm(): void {
    // Implement in derived class
  }

  handleErrorResponse(error: any): void {
    // Implement in derived class
  }
}
