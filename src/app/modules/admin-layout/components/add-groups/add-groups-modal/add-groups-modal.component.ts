import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AddProductService } from 'src/app/services/add-product.service';
AddProductService;
@Component({
  selector: 'app-add-groups-modal',
  templateUrl: './add-groups-modal.component.html',
  styleUrls: ['./add-groups-modal.component.css'],
})
export class AddGroupsModalComponent implements OnChanges {
  @Input() isEditMode!: boolean;
  @Output() formSubmitted = new EventEmitter<any>();
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
  existingImagePath: string = '';
  currentGroup: any = null;
  activeGroupId: number | null = null;
  imagePathPreview: string = '';
  alertTitle: any;

  constructor(private addProductService: AddProductService) {}

  toggleAddProductGroupDiv(): void {
    this.showProductDiv = !this.showProductDiv;
    this.btnIndex = -1;
    this.getProductGroup(-1);
    this.ngOnInit();
  }

  showApprovalProductGrid(): void {
    this.showProductDiv = false;
    this.addGroupForm.reset();
  }

  ngOnInit() {
    this.addGroupForm = new FormGroup({
      productGroupName: new FormControl('', Validators.required),
      productGroupImage: new FormControl('', Validators.required),
      productGroupPrefix: new FormControl('', Validators.required),
      productGroupDetails: new FormControl(''),
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
    console.log(this.isEditMode);
    this.addGroupForm.reset();
    this.isEditMode = false;
    this.currentGroup = null;
    this.activeGroupId = null;
  }

  onSubmit() {
    if (this.addGroupForm.valid) {
      // Emit form submission event to parent component
      this.formSubmitted.emit(this.addGroupForm.value);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    // if (changes.isEditMode && !changes.isEditMode.firstChange) {
    //   // Handle changes to isEditMode here
    //   // For example, if you need to reset the form when editMode changes
    //   this.resetForm();
    // }
    console.log('changes', changes);
  }

  getProductGroup(status: any) {
    this.btnIndex = status;
    console.log(this.btnIndex);
    this.allSelectedCheckbox.nativeElement.checked = false;
    this.selectedProducts1.length = 0;
    this.selectAll = false;
    this.addProductService.GetProductGroupsListByStatus(status).subscribe({
      next: (response: any) => {
        // console.log(response);
        this.groupList = response;
      },
      error: (error: any) => {
        //console.log(error);
        this.alertMsg = error.error.message;
        this.UserExistModalBTN.nativeElement.click();
      },
    });
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
    this.currentGroup = group;

    // Ensure the modal is opened before calling displayImage

    this.displayImage(group.imagepath);
    this.activeGroupId = group.productGroupID;
  }
  populateForm(group: any): void {
    this.addGroupForm.patchValue({
      productGroupName: group.productGroupName,
      productGroupPrefix: group.productGroupPrefix,
      productGroupDetails: group.productGroupDetails,
    });

    this.displayImage(group.imagepath);
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

  updateIsActive(event: { isActive: any; productGroupId: any }) {
    console.log(event.isActive, 'isActive', event.productGroupId, 'groupId');
    this.addProductService
      .updateProductGroupStatus(event.productGroupId.toString(), event.isActive)
      .subscribe({
        next: (response: any) => {
          // console.log(response);
          event.isActive = event.isActive === true ? 1 : 0;

          this.getProductGroup(event.isActive);
          this.btnIndex = event.isActive;
          this.UserExistModalBTN.nativeElement.click();
          this.alertMsg = event.isActive
            ? 'Product is  Activated!'
            : 'Product is Deactivated!';
          this.alertTitle = event.isActive ? 'Activated!' : 'Deactivated!';
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
    this.groupList.forEach(
      (product: { isSelected: boolean; productGroupID: any }) => {
        product.isSelected = this.selectAll;

        // Update the selectedProducts array based on the state of each checkbox
        if (
          this.selectAll &&
          !this.selectedProducts1.includes(product.productGroupID)
        ) {
          this.selectedProducts1.push(product.productGroupID);
        } else if (
          !this.selectAll &&
          this.selectedProducts1.includes(product.productGroupID)
        ) {
          // Remove the deselected product from the list
          this.selectedProducts1 = this.selectedProducts1.filter(
            (id) => id !== product.productGroupID
          );
          this.selectAll = false;
        }
      }
    );

    // console.log('Selected Product IDs:', this.selectedProducts1);
    // console.log("this.selectedProducts1.length",this.selectedProducts1.length);
    // console.log("this.selectedProducts1.length",this.productList.length);
  }

  chageActiveInactive(isActive: any) {
    // console.log("hello ");

    // console.log("get groupIds are ",this.selectedProducts1);
    // console.log("is active are",isActive);

    if (this.selectedProducts1.length > 0) {
      // console.log("selectedProducts1",this.selectedProducts1.toString());
      // console.log("selectedProducts1",isActive);

      this.addProductService
        .updateProductGroupStatus(this.selectedProducts1.toString(), isActive)
        .subscribe({
          next: (response: any) => {
            console.log(response);
            isActive = isActive === true ? 0 : 1;
            this.getProductGroup(isActive);

            this.btnIndex = isActive;
            this.UserExistModalBTN.nativeElement.click();
            this.alertMsg = isActive
              ? 'Group is  Deactivated!'
              : 'Group is Activated!';
            this.alertTitle = isActive ? 'Deactiveted!' : 'Activeted!';
            this.selectAll = false;
            this.selectedProducts1.length = 0;
            console.log(this.alertTitle);
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

  checkboxSelected(event: { groupId: any; event: any }) {
    console.log('productId', event.groupId);
    console.log(event.event);
    const isSelected: boolean = event.event.target.checked;
    // console.log("event is",isSelected);
    // console.log(isSelected);
    if (isSelected && !this.selectedProducts1.includes(event.groupId)) {
      // Add the selected product to the list
      this.selectedProducts1.push(event.groupId);
    } else if (!isSelected && this.selectedProducts1.includes(event.groupId)) {
      // Remove the deselected product from the list
      this.selectedProducts1 = this.selectedProducts1.filter(
        (id) => id !== event.groupId
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
