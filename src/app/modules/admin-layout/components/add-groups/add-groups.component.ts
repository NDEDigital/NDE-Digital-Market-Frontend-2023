import { Component, ElementRef, ViewChild, DestroyRef } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddProductService } from 'src/app/services/add-product.service';
import { TableHeadersService } from 'src/app/services/table-headers.service';
@Component({
  selector: 'app-add-groups',
  templateUrl: './add-groups.component.html',
  styleUrls: ['./add-groups.component.css'],
})
export class AddGroupsComponent {
  // ViewChild references to various HTML elements
  @ViewChild('userExistModalBTN') UserExistModalBTN!: ElementRef;
  @ViewChild('productGroupImageInput') productImageInput!: ElementRef;
  @ViewChild('addGroupModalCenterG') addGroupModalCenterG!: ElementRef;
  @ViewChild('modalGroupImage') modalGroupImage!: ElementRef<HTMLImageElement>;
  @ViewChild('allselected', { static: true })
  allSelectedCheckbox!: ElementRef<HTMLInputElement>;

  // Array to hold table headers
  headers!: string[];
  // Array to hold the list of product groups
  groupList: any[] = [];
  // Array to store selected product IDs
  selectedProductIds: any[] = [];
  // Array to store selected products
  selectedProducts1: any[] = [];

  // Form group for adding/editing product groups
  addGroupForm!: FormGroup;
  // Currently selected group
  currentGroup: any = null;

  // Alert message and title
  alertMsg = '';
  alertTitle = '';
  // Paths for existing and previewed images
  existingImagePath = '';
  imagePathPreview = '';

  // Variable to track hovered item
  isHovered: any | null = null;
  // Flags for button clicks and mode
  btnClick = false;
  addbtnClickP = false;
  // Flag for displaying product division
  showProductDiv = false;
  // Flag for indicating error state
  isError = false;
  // Flag for edit mode
  isEditMode = false;
  // Flag for selecting all products
  selectAll = false;

  // Index for button and add button
  btnIndex = -1;
  addBtnIndex = 5;
  // Active group ID
  activeGroupId: number | null = null;
  // Data for double-clicked item
  doubleClickData!: any;

  constructor(
    private addProductService: AddProductService,
    private tableHeadersService: TableHeadersService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    // Initialize component
    this.getProductGroup(-1);
    this.headers = this.tableHeadersService.productGroupsTableHeaders;
  }

  /**
   * Opens the modal for adding a new product group.
   */
  openAddGroupModal(): void {
    this.isEditMode = false;
    this.currentGroup = null;
    this.btnClick = true;
    this.openModalWithData(null);
  }

  /**
   * Resets the form.
   */
  resetForm(): void {
    this.isEditMode = false;
    this.addbtnClickP = false;
  }

  /**
   * Handles form submission.
   * @param formData Form data to be submitted
   */
  onSubmit(formData: any): void {
    this.isEditMode
      ? this.updateProductGroup(formData)
      : this.createProductGroup(formData);
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
   * Retrieves product groups based on status.
   * @param status Status of the product groups to retrieve
   */
  getProductGroup(status: number): void {
    this.btnIndex = status;
    this.allSelectedCheckbox.nativeElement.checked = false;
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
   * Opens the modal with existing data.
   * @param group Existing group data
   */
  openModalWithData(group: any): void {
    this.isEditMode = !!group;
    this.currentGroup = group;
    this.btnClick = true;
    this.addbtnClickP = !group;
    if (group) {
      this.doubleClickData = group;
      this.activeGroupId = group.productGroupID;
    }
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
   * Toggles the selection of all checkboxes.
   */
  toggleAllCheckboxes(): void {
    this.groupList.forEach(
      (product: { isSelected: boolean; productGroupID: any }) => {
        product.isSelected = this.selectAll;
        this.updateSelectedProducts(product);
      }
    );
  }

  /**
   * Updates the list of selected products.
   * @param product Product to update selection status
   */
  updateSelectedProducts(product: {
    isSelected: boolean;
    productGroupID: any;
  }): void {
    if (
      this.selectAll &&
      !this.selectedProducts1.includes(product.productGroupID)
    ) {
      this.selectedProducts1.push(product.productGroupID);
    } else if (
      !this.selectAll &&
      this.selectedProducts1.includes(product.productGroupID)
    ) {
      this.selectedProducts1 = this.selectedProducts1.filter(
        (id) => id !== product.productGroupID
      );
    }
  }

  /**
   * Changes the active/inactive status of selected product groups.
   * @param isActive Flag indicating whether to activate or deactivate
   */
  chageActiveInactive(isActive: any) {
    if (this.selectedProducts1.length > 0) {
      this.updateProductGroupStatus(isActive);
    } else {
      this.alertTitle = 'No Selection!';
      this.alertMsg = 'No group is selected';
      this.showModalAndResetForm();
    }
  }

  /**
   * Updates the status of selected product groups.
   * @param isActive Flag indicating whether to activate or deactivate
   */
  updateProductGroupStatus(isActive: number): void {
    this.addProductService
      .updateProductGroupStatus(this.selectedProducts1.toString(), isActive)
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
   * Handles selection of checkboxes.
   * @param event Event containing group ID and checkbox state
   */
  checkboxSelected(event: { groupId: any; event: any }): void {
    const isSelected: boolean = event.event.target.checked;
    if (isSelected && !this.selectedProducts1.includes(event.groupId)) {
      this.selectedProducts1.push(event.groupId);
    } else if (!isSelected && this.selectedProducts1.includes(event.groupId)) {
      this.selectedProducts1 = this.selectedProducts1.filter(
        (id) => id !== event.groupId
      );
    }
    this.updateSelectAllCheckbox();
  }

  /**
   * Updates the state of the select-all checkbox.
   */
  updateSelectAllCheckbox(): void {
    this.allSelectedCheckbox.nativeElement.checked =
      this.selectedProducts1.length === this.groupList.length;
  }

  /**
   * Shows alert message and resets the form.
   * @param newStatus New status of the product
   */
  showAlertAndResetForm(newStatus: number): void {
    this.alertMsg = newStatus
      ? 'Product is Activated!'
      : 'Product is Deactivated!';
    this.alertTitle = newStatus ? 'Activated!' : 'Deactivated!';
    this.showModalAndResetForm();
  }

  /**
   * Shows modal and resets the form.
   */
  showModalAndResetForm(): void {
    this.UserExistModalBTN.nativeElement.click();
    this.addGroupForm.reset();
  }

  /**
   * Handles error responses.
   * @param error Error response
   */
  handleErrorResponse(error: any): void {
    this.alertMsg = error.error.message;
    this.isError = true;
    this.UserExistModalBTN.nativeElement.click();
  }
}
