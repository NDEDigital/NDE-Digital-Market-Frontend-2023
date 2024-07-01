import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BrandsService } from 'src/app/services/brands.service';
import { TableHeadersService } from 'src/app/services/table-headers.service';
import { AlertHandleBase } from '../../common/alert-handle-base';
@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css'],
})
export class BrandsComponent extends AlertHandleBase implements AfterViewInit {
  // ViewChild references to various HTML elements
  @ViewChild('userExistModalBTN') override UserExistModalBTN!: ElementRef;

  @ViewChild('allselected', { static: true })
  allSelectedCheckbox!: ElementRef<HTMLInputElement>;
  // Array to hold table headers
  headers!: string[];
  isHovered: any | null = null;
  addBtnIndex = 9;
  showProductDiv: boolean = false;
  groupList: any;
  btnIndex = -1;
  isEditMode = false;
  existingImagePath: string = '';
  currentGroup: any = null;
  activeGroupId: number | null = null;
  imagePathPreview: string = '';
  doubleClickData!: any;
  // Flags for button clicks and mode
  btnClick = false;
  addbtnClickP = false;
  selectedProductIds: any[] = [];
  selectedProducts1: any[] = [];

  selectAll = false;
  constructor(
    protected brandsService: BrandsService,
    protected tableHeadersService: TableHeadersService,
    protected destroyRef: DestroyRef
  ) {
    super();
  }
  ngAfterViewInit(): void {
    // Ensure UserExistModalBTN is set
    if (!this.UserExistModalBTN) {
      console.error('UserExistModalBTN ViewChild is not initialized.');
    }
  }

  ngOnInit() {
    // Initialize component
    this.getNewBrands(-1);
    this.headers = this.tableHeadersService.brandTableHeaders;
  }
  /**
   * Opens the modal for adding a new product group.
   */
  openAddBrandModal(): void {
    console.log('ashce');
    this.isEditMode = false;
    this.currentGroup = null;
    this.btnClick = true;
    this.openModalWithData(null);
  }

  openModalWithData(group: any): void {
    this.isEditMode = !!group;
    this.currentGroup = group;
    this.btnClick = true;
    this.addbtnClickP = !group;
    console.log('ashce modal e');
    if (group) {
      this.doubleClickData = group;
      this.activeGroupId = group.productGroupID;
    }
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
    this.isEditMode ? this.updateBrands(formData) : this.createBrands(formData);
  }
  /**
   * Creates a new brand.
   * @param formData Form data for creating the brand
   */
  createBrands(formData: any) {
    this.brandsService
      .createBrand(formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.alertMsg = response.message;
          this.isError = false;
          setTimeout(() => {
            this.showModalAndResetForm();
          }, 50);
          this.getNewBrands(-1);
        },
        error: (error: any) => {
          this.handleErrorResponse(error);
        },
      });
  }

  /**
   * Updates an existing brand.
   * @param formData Form data for updating the brand
   */
  updateBrands(formData: any) {
    const updateByUser = localStorage.getItem('code');
    formData.append('brandId', this.currentGroup.brandId);
    if (updateByUser !== null) {
      formData.append('updatedBy', updateByUser);
    } else {
      console.error('Update by code not found in localStorage');
    }
    formData.append('updatedPC', '0.0.0.0');
    for (let [key, value] of (formData as any).entries()) {
      console.log(key, value);
    }
    this.brandsService
      .updateBrand(formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.alertMsg = 'Brand updated successfully';
          this.isEditMode = false;

          setTimeout(() => {
            this.showModalAndResetForm();
          }, 50);
          this.getNewBrands(-1);
        },
        error: (error: any) => {
          this.handleErrorResponse(error);
        },
      });
    console.log(this.isEditMode, 'updating on submit');
  }
  /**
   * Retrieves brands based on status.
   * @param status Status of the brands to retrieve
   */
  getNewBrands(status: any) {
    this.btnIndex = status;
    if (status == 0) {
      status = false;
    } else if (status == 1) {
      status = true;
    }
    this.allSelectedCheckbox.nativeElement.checked = false;
    this.selectedProducts1.length = 0;
    this.selectAll = false;
    if (status != -1) {
      this.brandsService
        .getBrands(status)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response: any) => {
            this.groupList = response;
          },
          error: (error: any) => {
            this.handleErrorResponse(error);
          },
        });
    } else {
      this.brandsService
        .getNewBrands()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response: any) => {
            console.log(response);
            this.groupList = response;
          },
          error: (error: any) => {
            this.handleErrorResponse(error);
          },
        });
    }
  }

  updateIsActive(status: any, brandId: any) {
    console.log(status, 'isActive', brandId, 'groupId');
    this.brandsService
      .updateUnitsActiveStatus(brandId.toString(), status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          // console.log(response);
          const newStatus = status ? 1 : 0;

          this.getNewBrands(newStatus);
          this.showAlertAndResetForm(newStatus);
          this.showModalAndResetForm();
        },
        error: (error: any) => {
          //console.log(error);
          this.alertMsg = error.error.message;
        },
      });
  }

  /**
   * Toggles the selection of all checkboxes.
   */
  toggleAllCheckboxes() {
    this.groupList.forEach((brand: { isSelected: boolean; brandId: any }) => {
      brand.isSelected = this.selectAll;
      this.updateSelectedProducts(brand);
    });
  }
  /**
   * Updates the list of selected brands.
   * @param brand Brand to update selection status
   */
  updateSelectedProducts(brand: { isSelected: boolean; brandId: any }): void {
    // Update the selectedProducts array based on the state of each checkbox
    if (this.selectAll && !this.selectedProducts1.includes(brand.brandId)) {
      this.selectedProducts1.push(brand.brandId);
    } else if (
      !this.selectAll &&
      this.selectedProducts1.includes(brand.brandId)
    ) {
      // Remove the deselected product from the list
      this.selectedProducts1 = this.selectedProducts1.filter(
        (id) => id !== brand.brandId
      );
      this.selectAll = false;
    }
  }
  /**
   * Updates the status of selected product groups.
   * @param isActive Flag indicating whether to activate or deactivate
   */
  updateBrandsStatus(isActive: number): void {
    this.brandsService
      .updateUnitsActiveStatus(this.selectedProducts1.toString(), isActive)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          const newStatus = isActive ? 1 : 0;
          this.getNewBrands(newStatus);
          this.showBrandsAlertAndResetForm(newStatus);
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
   * Changes the active/inactive status of selected brands .
   * @param isActive Flag indicating whether to activate or deactivate
   */
  chageActiveInactive(isActive: any) {
    if (this.selectedProducts1.length > 0) {
      this.updateBrandsStatus(isActive);
    } else {
      this.alertTitle = 'No Selection!';
      this.alertMsg = 'No group is selected';
      this.showModalAndResetForm();
    }
  }

  /**
   * Handles selection of checkboxes.
   * @param event Event containing brand ID and checkbox state
   */
  checkboxSelected(event: { brandId: any; event: any }) {
    const { brandId, event: domEvent } = event;
    const isSelected: boolean = domEvent.target.checked;

    if (isSelected && !this.selectedProducts1.includes(brandId)) {
      this.selectedProducts1.push(brandId);
    } else if (!isSelected && this.selectedProducts1.includes(brandId)) {
      this.selectedProducts1 = this.selectedProducts1.filter(
        (id) => id !== brandId
      );
    }
    this.updateSelectAllCheckbox();
  }
  /**
   * Updates the state of the select-all checkbox.
   */
  updateSelectAllCheckbox(): void {
    this.allSelectedCheckbox.nativeElement.checked = false;
    this.selectedProductIds = this.selectedProducts1.slice();
    if (this.selectedProducts1.length === this.groupList.length) {
      this.allSelectedCheckbox.nativeElement.checked = true;
    }
  }
}
