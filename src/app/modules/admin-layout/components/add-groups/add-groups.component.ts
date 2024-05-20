import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AddProductService } from 'src/app/services/add-product.service';
import { TableHeadersService } from 'src/app/services/table-headers.service';
@Component({
  selector: 'app-add-groups',
  templateUrl: './add-groups.component.html',
  styleUrls: ['./add-groups.component.css'],
})
export class AddGroupsComponent {
  @ViewChild('userExistModalBTN') UserExistModalBTN!: ElementRef;
  @ViewChild('productGroupImageInput') productImageInput!: ElementRef;
  @ViewChild('addGroupModalCenterG') addGroupModalCenterG!: ElementRef;
  @ViewChild('modalGroupImage') modalGroupImage!: ElementRef<HTMLImageElement>;
  @ViewChild('allselected', { static: true })
  allSelectedCheckbox!: ElementRef<HTMLInputElement>;

  headers!: string[];
  groupList: any[] = [];
  selectedProductIds: any[] = [];
  selectedProducts1: any[] = [];

  addGroupForm!: FormGroup;
  currentGroup: any = null;

  alertMsg = '';
  alertTitle = '';
  existingImagePath = '';
  imagePathPreview = '';

  isHovered: any | null = null;
  btnClick = false;
  addbtnClickP = false;
  showProductDiv = false;
  isError = false;
  isEditMode = false;
  selectAll = false;

  btnIndex = -1;
  addBtnIndex = 5;
  activeGroupId: number | null = null;
  doubleClickData!: any;

  constructor(
    private addProductService: AddProductService,
    private tableHeadersService: TableHeadersService
  ) {}

  ngOnInit() {
    this.getProductGroup(-1);
    this.headers = this.tableHeadersService.productGroupsTableHeaders;
  }

  openAddGroupModal(): void {
    this.isEditMode = false;
    this.currentGroup = null;
    this.btnClick = true;
    this.openModalWithData(null);
  }

  resetForm(): void {
    this.isEditMode = false;
    this.addbtnClickP = false;
  }

  onSubmit(formData: any): void {
    this.isEditMode
      ? this.updateProductGroup(formData)
      : this.createProductGroup(formData);
  }

  createProductGroup(formData: any): void {
    this.addProductService.createProductGroup(formData).subscribe({
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

  updateProductGroup(formData: any): void {
    const updateByUser = localStorage.getItem('code') || 'Unknown';
    formData.append('ProductGroupID', this.currentGroup.productGroupID);
    formData.append('UpdatedBy', updateByUser);
    formData.append('UpdatedPC', '0.0.0.0');

    this.addProductService.updateProductGroup(formData).subscribe({
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

  getProductGroup(status: number): void {
    this.btnIndex = status;
    this.allSelectedCheckbox.nativeElement.checked = false;
    this.selectedProducts1.length = 0;
    this.selectAll = false;

    this.addProductService.GetProductGroupsListByStatus(status).subscribe({
      next: (response: any) => {
        this.groupList = response;
      },
      error: (error: any) => {
        this.handleErrorResponse(error);
      },
    });
  }

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

  updateIsActive(event: { isActive: any; productGroupId: number }): void {
    this.addProductService
      .updateProductGroupStatus(event.productGroupId.toString(), event.isActive)
      .subscribe({
        next: () => {
          event.isActive = event.isActive ? 1 : 0;
          this.getProductGroup(event.isActive);
          this.alertMsg = event.isActive
            ? 'Product is Activated!'
            : 'Product is Deactivated!';
          this.alertTitle = event.isActive ? 'Activated!' : 'Deactivated!';
          this.showModalAndResetForm();
        },
        error: (error: any) => {
          this.handleErrorResponse(error);
        },
      });
  }

  toggleAllCheckboxes(): void {
    this.groupList.forEach(
      (product: { isSelected: boolean; productGroupID: any }) => {
        product.isSelected = this.selectAll;
        this.updateSelectedProducts(product);
      }
    );
  }

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

  chageActiveInactive(isActive: any) {
    if (this.selectedProducts1.length > 0) {
      this.updateProductGroupStatus(isActive);
    } else {
      this.alertTitle = 'No Selection!';
      this.alertMsg = 'No group is selected';
      this.showModalAndResetForm();
    }
  }

  updateProductGroupStatus(isActive: number): void {
    this.addProductService
      .updateProductGroupStatus(this.selectedProducts1.toString(), isActive)
      .subscribe({
        next: () => {
          isActive = isActive ? 0 : 1;
          this.getProductGroup(isActive);
          this.alertMsg = isActive
            ? 'Group is Deactivated!'
            : 'Group is Activated!';
          this.alertTitle = isActive ? 'Deactivated!' : 'Activated!';
          this.selectAll = false;
          this.selectedProducts1.length = 0;
          this.showModalAndResetForm();
        },
        error: (error: any) => {
          this.handleErrorResponse(error);
        },
      });
  }

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

  updateSelectAllCheckbox(): void {
    this.allSelectedCheckbox.nativeElement.checked =
      this.selectedProducts1.length === this.groupList.length;
  }

  showModalAndResetForm(): void {
    this.UserExistModalBTN.nativeElement.click();
    this.addGroupForm.reset();
  }
  handleErrorResponse(error: any): void {
    this.alertMsg = error.error.message;
    this.isError = true;
    this.UserExistModalBTN.nativeElement.click();
  }
}
