import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { AddProductService } from 'src/app/services/add-product.service';
import { TableHeadersService } from 'src/app/services/table-headers.service';
import { UnitService } from 'src/app/services/unit.service';
import { AlertHandleBase } from '../../common/alert-handle-base';

import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.css'],
})
export class UnitListComponent
  extends AlertHandleBase
  implements AfterViewInit
{
  // ViewChild references to various HTML elements
  @ViewChild('userExistModalBTN') override UserExistModalBTN!: ElementRef;
  @ViewChild('allselected', { static: true })
  allSelectedCheckbox!: ElementRef<HTMLInputElement>;
  headers!: string[];
  isHovered: any | null = null;
  addBtnIndex = 7;
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
    protected destroyRef: DestroyRef,
    private unitServices: UnitService,
    private tableHeadersService: TableHeadersService
  ) {
    super();
  }

  ngOnInit() {
    // Initialize component
    this.getProductGroup(-1);
    this.headers = this.tableHeadersService.unitListTableHeaders;
  }
  ngAfterViewInit(): void {
    // Ensure UserExistModalBTN is set
    if (!this.UserExistModalBTN) {
      console.error('UserExistModalBTN ViewChild is not initialized.');
    }
  }
  /**
   * Opens the modal for adding a new product group.
   */
  openAddGroupModal(): void {
    // console.log('ashce');
    this.isEditMode = false;
    this.currentGroup = null;
    this.btnClick = true;
    this.openModalWithData(null);
  }

  openModalWithData(group: any): void {
    console.log('ashce modal e');
    this.isEditMode = !!group;
    this.currentGroup = group;
    this.btnClick = true;
    this.addbtnClickP = !group;
    console.log('brand', group);
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
    this.isEditMode ? this.updateUnit(formData) : this.createUnit(formData);
  }

  /**
   * Creates a new brand.
   * @param formData Form data for creating the unit
   */
  createUnit(formData: any) {
    this.unitServices
      .createUnit(formData)
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
  updateUnit(formData: any) {
    let updateByUser = localStorage.getItem('code');
    // console.log('new new new new', this.currentGroup.unitId);
    // console.log('ne ne ne ne', encodeURIComponent(this.currentGroup.unitId));
    formData.append('unitId', this.currentGroup.unitId);

    if (updateByUser !== null) {
      formData.append('updatedBy', updateByUser);
    } else {
      console.error('Update by code not found in localStorage');
    }
    formData.append('updatedPC', '0.0.0.0');
    console.log('form value', formData);
    for (let [key, value] of (formData as any).entries()) {
      console.log(key, value, 'update unit6 values');
    }
    this.unitServices
      .updateUnitName(formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.alertMsg = 'Unit updated successfully';
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
   * Retrieves units based on status.
   * @param status Status of the brands to retrieve
   */
  getProductGroup(status: any) {
    console.log(status);
    this.btnIndex = status;
    if (status == 1) {
      status = true;
    } else if (status == 0) {
      status = false;
    }
    this.allSelectedCheckbox.nativeElement.checked = false;
    this.selectedProducts1.length = 0;
    this.selectAll = false;
    if (status != -1) {
      this.unitServices
        .getUnitGroups(status)
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
      this.unitServices
        .getUnitGroup()
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

  updateIsActive(status: Boolean, unitIds: any) {
    console.log(status, 'status new new', unitIds, 'unitIds');
    this.unitServices
      .updateUnitActiveStatus(encodeURIComponent(unitIds.toString()), status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          const newStatus = status ? 1 : 0;
          this.getProductGroup(newStatus);
          this.showAlertAndResetForm(newStatus);
          this.showModalAndResetForm();
        },
        error: (error: any) => {
          console.log(error);
          this.alertMsg = error.error.message;
        },
      });
  }

  /**
   * Toggles the selection of all checkboxes.
   */
  toggleAllCheckboxes() {
    console.log('group list are', this.groupList);

    this.groupList.forEach((unit: { isSelected: boolean; unitId: any }) => {
      unit.isSelected = this.selectAll;
      this.updateSelectedProducts(unit);
    });
  }
  /**
   * Updates the list of selected units.
   * @param unit Unit to update selection status
   */
  updateSelectedProducts(unit: { isSelected: boolean; unitId: any }) {
    if (this.selectAll && !this.selectedProducts1.includes(unit.unitId)) {
      this.selectedProducts1.push(encodeURIComponent(unit.unitId));
    } else if (
      !this.selectAll &&
      this.selectedProducts1.includes(encodeURIComponent(unit.unitId))
    ) {
      this.selectedProducts1 = this.selectedProducts1.filter(
        (id) => id !== encodeURIComponent(unit.unitId)
      );
      this.selectAll = false;
    }
  }
  updateUnitsStatus(isActive: number): void {
    console.log(this.selectedProducts1.toString(), 'thik nai thik nai');
    this.unitServices
      .updateUnitsActiveStatus(this.selectedProducts1.toString(), isActive)
      .subscribe({
        next: (response: any) => {
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
   * Changes the active/inactive status of selected units .
   * @param isActive Flag indicating whether to activate or deactivate
   */
  chageActiveInactive(isActive: any) {
    if (this.selectedProducts1.length > 0) {
      this.updateUnitsStatus(isActive);
    } else {
      this.UserExistModalBTN.nativeElement.click();
      this.alertTitle = 'No Selection!';

      this.alertMsg = 'No group is selected';
    }
  }
  /**
   * Handles selection of checkboxes.
   * @param event Event containing unit ID and checkbox state
   */
  checkboxSelected(event: { unitId: any; event: any }) {
    const { unitId, event: domEvent } = event;
    const isSelected: boolean = domEvent.target.checked;
    if (isSelected && !this.selectedProducts1.includes(unitId)) {
      this.selectedProducts1.push(encodeURIComponent(unitId));
    } else if (!isSelected && this.selectedProducts1.includes(unitId)) {
      this.selectedProducts1 = this.selectedProducts1.filter(
        (id) => id !== unitId
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
