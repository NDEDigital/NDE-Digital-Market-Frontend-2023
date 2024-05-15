import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AddProductService } from 'src/app/services/add-product.service';
import { UnitService } from 'src/app/services/unit.service';
@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.css'],
})
export class UnitListComponent {
  @ViewChild('userExistModalBTN') UserExistModalBTN!: ElementRef;
  @ViewChild('productGroupImageInput') ProductImageInput!: ElementRef;
  @ViewChild('addGroupModalCenterG') AddGroupModalCenterG!: ElementRef;
  //@ViewChild('modalGroupImage') ModalGroupImage!: ElementRef;
  @ViewChild('modalGroupImage') ModalGroupImage!: ElementRef<HTMLImageElement>;
  @ViewChild('allselected', { static: true })
  allSelectedCheckbox!: ElementRef<HTMLInputElement>;

  isHovered: any | null = null;

  addGroupForm!: FormGroup;
  alertMsg = '';
  showProductDiv: boolean = false;
  groupList: any;
  btnIndex = -1;
  isError: boolean = false;
  isEditMode = false;
  existingImagePath: string = '';
  currentGroup: any = null;
  activeGroupId: number | null = null;
  imagePathPreview: string = '';
  alertTitle: any;

  constructor(
    private addProductService: AddProductService,
    private unitServices: UnitService
  ) {}

  toggleAddProductGroupDiv(): void {
    this.showProductDiv = !this.showProductDiv;
    this.btnIndex = -1;
    this.getProductGroup(true);
    this.ngOnInit();
  }

  showApprovalProductGrid(): void {
    this.showProductDiv = false;
    this.addGroupForm.reset();
  }

  ngOnInit() {
    this.addGroupForm = new FormGroup({
      description: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
    });
    this.getProductGroup(-1);
  }

  openAddGroupModal(): void {
    this.resetForm();
    this.isEditMode = false;
    this.currentGroup = null;
    this.AddGroupModalCenterG.nativeElement.click();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.addGroupForm.get(fieldName);
    // Check if the field is not null before accessing its properties
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  resetForm(): void {
    this.addGroupForm.reset();
    this.isEditMode = false;
    this.currentGroup = null;
    this.activeGroupId = null;
  }

  onSubmit(): void {
    Object.values(this.addGroupForm.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
    });

    if (this.addGroupForm.valid) {
      console.log('Form Data:', this.addGroupForm.value);
      const formData = new FormData();

      Object.keys(this.addGroupForm.value).forEach((key) => {
        let value = this.addGroupForm.value[key];
        if (key === 'productId' || key === 'unitId') {
          value = String(Math.floor(Number(value)));
          //console.log(value);
        }
        formData.append(key, value);
      });

      // Append additional fields
      // let addedByUser = localStorage.getItem('code') || 'user';
      formData.append('addedBy', 'user');
      formData.append('addedPC', '0.0.0.0');
      // formData.append('isActive', true ? '1' : '0');
      // formData.append('isConversion', true ? '1' : '0');

      // for (let pair of (formData as any).entries()) {
      //   console.log(`${pair[0]}: `, pair[1]);
      // }
      if (!this.isEditMode) {
        console.log(formData);
        for (let [key, value] of (formData as any).entries()) {
          console.log(key, value);
        }
        this.unitServices.createUnit(formData).subscribe({
          next: (response: any) => {
            //console.log(response, 'successfull');
            this.alertMsg = response.message;
            this.isError = false;
            //console.log(response.message);
            setTimeout(() => {
              this.UserExistModalBTN.nativeElement.click();
              this.addGroupForm.reset();
              // this.toggleAddProductGroupDiv();
            }, 50);
            this.getProductGroup(-1);
          },
          error: (error: any) => {
            //console.log(error, 'error');
            this.alertMsg = error.error.message;
            this.isError = true;
            this.UserExistModalBTN.nativeElement.click();
          },
        });
      }
      // console.log(this.isEditMode, "inserting on submit");

      if (this.isEditMode) {
        let updateByUser = localStorage.getItem('code');
        console.log(updateByUser, 'code...');

        // console.log("edit mode");
        formData.append('unitId', this.currentGroup.unitId);
        if (updateByUser !== null) {
          formData.append('updatedBy', updateByUser);
        } else {
          console.error('Update by code not found in localStorage');
        }
        formData.append('updatedPC', '0.0.0.0');
        console.log('form value', formData);
        for (let [key, value] of (formData as any).entries()) {
          console.log(key, value);
        }
        this.unitServices.updateUnitName(formData).subscribe({
          next: (response: any) => {
            // Handle successful response here
            console.log('Update successful:', response);
            this.alertMsg = 'Unit updated successfully';
            this.isEditMode = false;
            // Optionally, reset the form and refresh the group list
            this.addGroupForm.reset();
            this.getProductGroup(-1);

            // Close the modal if you have one open
            this.UserExistModalBTN.nativeElement.click();
          },
          error: (error: any) => {
            // Handle error response here
            console.error('Error updating  unit:', error);
            this.alertMsg = error.error.message || 'Error updating  unit';
            this.isError = true;
            this.isEditMode = false;

            // Show the error modal or message
            this.UserExistModalBTN.nativeElement.click();
          },
        });
        console.log(this.isEditMode, 'updating on submit');
      }
    } else {
      console.log('Form is not valid');
    }
  }

  getProductGroup(status: any) {
    console.log(status);
    this.btnIndex = status;
    if (status == 0) {
      status = true;
    } else if (status == 1) {
      status = false;
    }
    this.allSelectedCheckbox.nativeElement.checked = false;
    this.selectedProducts1.length = 0;
    this.selectAll = false;
    if (status != -1) {
      this.unitServices.getUnitGroups(status).subscribe({
        next: (response: any) => {
          console.log(response);
          this.groupList = response;
        },
        error: (error: any) => {
          //console.log(error);
          this.alertMsg = error.error.message;
          this.UserExistModalBTN.nativeElement.click();
        },
      });
    } else {
      this.unitServices.getUnitGroup().subscribe({
        next: (response: any) => {
          console.log(response);
          this.groupList = response;
        },
        error: (error: any) => {
          //console.log(error);
          this.alertMsg = error.error.message;
          this.UserExistModalBTN.nativeElement.click();
        },
      });
    }
  }

  updateFormValidators(): void {
    // Check if the control exists
    const productGroupImageControl = this.addGroupForm.get('productGroupImage');
    if (productGroupImageControl) {
      if (this.isEditMode) {
        productGroupImageControl.clearValidators();
      } else {
        productGroupImageControl.setValidators(Validators.required);
      }
      productGroupImageControl.updateValueAndValidity();
    }
  }

  openModalWithData(group: any): void {
    this.isEditMode = true;
    this.updateFormValidators();
    console.log('group', group);
    this.populateForm(group);
    console.log(group);
    console.log('group ashce');
    this.currentGroup = group;

    // Ensure the modal is opened before calling displayImage
    this.displayImage(group.imagepath);
    this.activeGroupId = group.unitId;
  }
  populateForm(group: any): void {
    this.addGroupForm.patchValue({
      description: group.description,
      name: group.name,
      productGroupDetails: group.productGroupDetails,
    });

    this.existingImagePath = group.imagepath;
  }
  displayImage(imagePath: string): void {
    console.log('Received imagePath:', imagePath);

    if (imagePath) {
      const imageUrl = '/asset' + imagePath.split('asset')[1];

      console.log('Constructed imageUrl:', imageUrl);
      this.imagePathPreview = imageUrl;
    } else {
      this.imagePathPreview = 'not upload yet';
    }
    this.AddGroupModalCenterG.nativeElement.click();
  }

  updateIsActive(isActive: any, groupIds: any) {
    console.log(isActive, 'isActive', groupIds, 'groupId');
    this.unitServices
      .updateUnitActiveStatus(groupIds.toString(), isActive)
      .subscribe({
        next: (response: any) => {
          // console.log(response);
          const active = isActive == true ? 1 : 0;

          this.getProductGroup(isActive);
          if (isActive) {
            this.btnIndex = 1;
          } else {
            this.btnIndex = 0;
          }

          this.UserExistModalBTN.nativeElement.click();
          this.alertMsg = active
            ? 'Product is  Activated!'
            : 'Product is Deactivated!';
          this.alertTitle = active ? 'Activated!' : 'Deactivated!';
        },
        error: (error: any) => {
          //console.log(error);
          this.alertMsg = error.error.message;
        },
      });
  }

  selectedProductIds: any[] = [];
  selectedProducts1: any[] = [];

  selectAll = false;
  toggleAllCheckboxes() {
    console.log('all seelcted');
    // console.log('Selected Product IDs:', this.selectedProducts1);
    // console.log("product id's areeeeee",this.selectedProducts1)

    // Toggle the state of all checkboxes based on the "Select All" checkbox
    console.log('group list are', this.groupList);

    this.groupList.forEach((product: { isSelected: boolean; unitId: any }) => {
      product.isSelected = this.selectAll;

      // Update the selectedProducts array based on the state of each checkbox
      if (this.selectAll && !this.selectedProducts1.includes(product.unitId)) {
        this.selectedProducts1.push(product.unitId);
      } else if (
        !this.selectAll &&
        this.selectedProducts1.includes(product.unitId)
      ) {
        // Remove the deselected product from the list
        this.selectedProducts1 = this.selectedProducts1.filter(
          (id) => id !== product.unitId
        );
        this.selectAll = false;
      }
    });

    // console.log('Selected Product IDs:', this.selectedProducts1);
    // console.log("this.selectedProducts1.length",this.selectedProducts1.length);
    // console.log("this.selectedProducts1.length",this.productList.length);
  }

  chageActiveInactive(isActive: any) {
    // console.log("hello ");

    // console.log("get groupIds are ",this.selectedProducts1);
    // console.log("is active are",isActive);

    if (this.selectedProducts1.length > 0) {
      console.log('selectedProducts1', this.selectedProducts1.toString());
      // console.log("selectedProducts1",isActive);

      this.unitServices
        .updateUnitsActiveStatus(this.selectedProducts1.toString(), isActive)
        .subscribe({
          next: (response: any) => {
            console.log(response);
            this.getProductGroup(isActive);
            if (isActive) {
              this.btnIndex = 1;
            } else {
              this.btnIndex = 0;
            }
            this.UserExistModalBTN.nativeElement.click();
            this.alertMsg = isActive
              ? 'Group is  Deactivated!'
              : 'Group is Activated!';
            this.alertTitle = isActive ? 'Deactiveted!' : 'Activeted!';
            this.selectAll = false;
            this.selectedProducts1.length = 0;
            // console.log("product id's are",this.selectedProductIds)
          },
          error: (error: any) => {
            //console.log(error);
            this.alertMsg = error.error.message;
          },
        });
    } else {
      this.UserExistModalBTN.nativeElement.click();
      this.alertTitle = 'No Selection!';

      this.alertMsg = 'No group is selected';
    }
  }

  checkboxSelected(groupId: any, event: any) {
    // console.log("productId",groupId);

    const isSelected: boolean = event.target.checked;
    // console.log("event is",isSelected);
    // console.log(isSelected);
    if (isSelected && !this.selectedProducts1.includes(groupId)) {
      // Add the selected product to the list
      this.selectedProducts1.push(groupId);
    } else if (!isSelected && this.selectedProducts1.includes(groupId)) {
      // Remove the deselected product from the list
      this.selectedProducts1 = this.selectedProducts1.filter(
        (id) => id !== groupId
      );
    }
    this.allSelectedCheckbox.nativeElement.checked = false;
    // Update the selectedProductIds array with the current list of selected product IDs
    this.selectedProductIds = this.selectedProducts1.slice();
    if (this.selectedProducts1.length === this.groupList.length) {
      this.allSelectedCheckbox.nativeElement.checked = true;
    }
    //  console.log("selected areee",this.selectedProducts1);
  }
}
