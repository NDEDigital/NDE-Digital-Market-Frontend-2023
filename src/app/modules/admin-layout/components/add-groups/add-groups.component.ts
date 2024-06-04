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
import { AddGroupsBase } from './add-groups-base';
@Component({
  selector: 'app-add-groups',
  templateUrl: './add-groups.component.html',
  styleUrls: ['./add-groups.component.css'],
})
export class AddGroupsComponent extends AddGroupsBase {
  // ViewChild references to various HTML elements
  @ViewChild('userExistModalBTN') UserExistModalBTN!: ElementRef;
  @ViewChild('productGroupImageInput') productImageInput!: ElementRef;
  @ViewChild('addGroupModalCenterG') addGroupModalCenterG!: ElementRef;
  @ViewChild('modalGroupImage') modalGroupImage!: ElementRef<HTMLImageElement>;
  @ViewChild('allselected', { static: true })

  // Array to hold table headers
  headers!: string[];
  // Array to store selected product IDs
  selectedProductIds: any[] = [];

  // Form group for adding/editing product groups
  addGroupForm!: FormGroup;

  // Alert  title
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

  addBtnIndex = 5;
  // Active group ID
  activeGroupId: number | null = null;
  // Data for double-clicked item
  doubleClickData!: any;

  constructor(
    productGroupService: AddProductService,
    protected tableHeadersService: TableHeadersService,
    destroyRef: DestroyRef
  ) {
    super(productGroupService, destroyRef);
  }

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
  override showAlertAndResetForm(newStatus: number): void {
    this.alertMsg = newStatus
      ? 'Product is Activated!'
      : 'Product is Deactivated!';
    this.alertTitle = newStatus ? 'Activated!' : 'Deactivated!';
    this.showModalAndResetForm();
  }

  /**
   * Shows modal and resets the form.
   */
  override showModalAndResetForm(): void {
    this.UserExistModalBTN.nativeElement.click();
    // this.addGroupForm.reset();
  }

  /**
   * Handles error responses.
   * @param error Error response
   */
  override handleErrorResponse(error: any): void {
    this.alertMsg = error.error.message;
    this.isError = true;
    this.UserExistModalBTN.nativeElement.click();
  }
}
