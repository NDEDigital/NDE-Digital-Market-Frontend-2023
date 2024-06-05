import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import {
  Component,
  ElementRef,
  ViewChild,
  QueryList,
  DestroyRef,
} from '@angular/core';
import { AddProductService } from 'src/app/services/add-product.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-add-product-quantity',
  templateUrl: './add-product-quantity.component.html',
  styleUrls: ['./add-product-quantity.component.css'],
})
export class AddProductQuantityComponent {
  @ViewChild('searchInputRef') searchInputRef!: ElementRef;
  @ViewChild('receivedCode') receivedCode!: ElementRef;
  @ViewChild('receiveQtyField') receiveQtyFieldRefList!: QueryList<
    ElementRef<HTMLInputElement>
  >;
  isReceiveQtyReadOnly = false;
  portalReceivedId: any;
  isGoodsNameDropdownOpen: boolean = false;
  isGroupNameDropdownOpen: boolean = false;
  dropdown_ProductName: string = 'Product Name'; // Set an initial value
  selectedProductNames: string[] = []; // Initialize an array to hold selected product names for each row
  selectedProductGroup: any[] = [];
  allQuantyData: any[] = [];
  selectedProduct: any;
  selectedGroup: any;
  productdropDownIndex: any;
  NoProductFound = true;

  masterForm: FormGroup;
  form!: FormGroup;
  productDertailsData: any;
  productGroupData: any;
  portaldata: any;
  NoProduct = ' No product found';
  // ModalText = "Give some entry"

  constructor(
    private destroyRef: DestroyRef,
    private fb: FormBuilder,
    private addProductService: AddProductService
  ) {
    this.masterForm = this.fb.group({
      portalReceivedCode: [''],
      portalReceivedDate: [''],
      challanNo: ['', Validators.required],
      challanDate: ['', Validators.required],
      remarks: [''],
    });
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });
  }

  ngOnInit() {
    //   if( this.receivedCode.nativeElement.value)
    // {
    //   this.receiveQtyField.nativeElement.setAttribute('readonly', 'true');
    // }
  }
  getUserId() {
    return localStorage.getItem('code');
  }
  createRowGroup() {
    return this.fb.group({
      productName: ['', Validators.required],
      productId: [''],
      productGroupId: [''],
      specification: ['', Validators.required],
      unit: ['', Validators.required],
      unitId: [''],
      price: ['', Validators.required],
      receiveQty: ['', [Validators.required, Validators.pattern(/^-?\d+$/)]],
      availableQty: ['', Validators.required],
      remarks: [''],
      isDropdownOpen: [false],
    });
  }
  GetAddQuantityDataByUserId() {
    if (this.searchInputRef && this.searchInputRef.nativeElement) {
      this.searchInputRef.nativeElement.value = '';
    }
    const userID = this.getUserId();
    this.addProductService
      .GetAddQuantityDataByUserId(userID)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.allQuantyData = response;
        },
        error: (error) => {
          console.error('Error:', error);
        },
      });
  }
  get rowsFormArray(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  addRow() {
    if (this.receivedCode.nativeElement.value) {
      this.clear();
    }
    const rowsArray = this.rowsFormArray;

    if (rowsArray.length > 0) {
      const lastRow = rowsArray.at(rowsArray.length - 1) as FormGroup;
      if (!lastRow.valid) {
        console.log('Invalid row');
      }
      this.invisibleProductDropDown();
    }

    const newRow = this.createRowGroup();
    rowsArray.push(newRow);
    this.selectedProductNames.push('Select Product');
    this.selectedProductGroup.push('Select Group');
  }
  getPortalData(PortalReceivedId: any) {
    this.addProductService
      .GetPortalData(PortalReceivedId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.PatchForm(response.portalAfterInsert);
        },
        error: (error) => {
          console.error('Error:', error);
        },
      });
  }

  removeRow(index: number) {
    this.rowsFormArray.removeAt(index);
    if (this.selectedProductNames[index]) {
      this.selectedProductNames.splice(index, 1);
    }
    if (this.selectedProductGroup[index]) {
      this.selectedProductGroup.splice(index, 1);
    }
  }

  onSubmit() {
    const formData = this.form.value;
    console.log(formData);
  }

  isFormValid(): boolean {
    return this.form.valid;
  }

  submit() {
    if (this.isFormValid() && this.rowsFormArray.length) {
      const formData = this.form.value;
      this.portaldata = {
        challanNo: this.masterForm.value.challanNo,
        remarks: this.masterForm.value.remarks,
        userId: this.getUserId(),
        companyCode: 'CMP-23-0009',
        addedBy: 'string',
        addedPC: 'string',
        portalReceivedDetailslist: formData.rows.map((row: any) => ({
          productGroupId: row.productId,
          productId: row.productId,
          specification: row.specification,
          receivedQty: parseInt(row.receiveQty, 10),
          unitId: parseInt(row.unitId, 10),
          price: row.price,
          remarks: row.remarks,
          totalPrice: parseInt(row.receiveQty, 10) * row.price,
          userId: this.getUserId(),
          addedBy: 'string',
          addedPC: 'string',
        })),
      };

      if (this.masterForm.value.challanDate) {
        this.portaldata.challanDate = this.masterForm.value.challanDate;
      }

      this.addProductService
        .insertPortalReceived(this.portaldata)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            this.masterForm.reset();
            this.form.reset();
            this.selectedProductNames = [];
            this.selectedProductGroup = [];
            this.getPortalData(response.portalReceivedId);
          },
          error: (error) => {
            console.error('Error:', error);
          },
        });
    } else {
      console.log('Form is invalid');
    }
  }
  PatchForm(data: any) {
    this.isReceiveQtyReadOnly = !!this.receivedCode.nativeElement.value;
    this.masterForm.patchValue({
      challanNo: data.challanNo,
      remarks: data.remarks,
      portalReceivedCode: data.portalReceivedCode,
      portalReceivedDate: data.materialReceivedDate
        ? data.materialReceivedDate.split('T')[0]
        : null,
      challanDate: data.challanDate ? data.challanDate.split('T')[0] : null,
    });

    const detailsFormArray = this.rowsFormArray;
    detailsFormArray.clear();
    this.selectedProductGroup = [];
    this.selectedProductNames = [];
    data.portalReceivedDetailAfterInsertlList.forEach((detail: any) => {
      detailsFormArray.push(
        this.fb.group({
          productId: detail.productId,
          productName: detail.productName,
          GroupName: detail.productGroupName,
          productGroupId: detail.productGroupId,
          specification: detail.specification,
          unit: detail.unit,
          unitId: detail.unitId,
          price: detail.price,
          receiveQty: detail.receivedQty,
          availableQty: detail.availableQty,
          remarks: detail.remarks,
        })
      );
      this.selectedProductNames.push(detail.productName);
      this.selectedProductGroup.push(detail.productGroupName);
    });
  }

  isDropdownVisible(rowIndex: number): boolean {
    this.productdropDownIndex = rowIndex;
    const rowGroup = this.rowsFormArray.at(rowIndex) as FormGroup;
    return rowGroup.get('isDropdownOpen')?.value === true;
  }

  toggleDropdown(rowIndex: number): void {
    // Close all dropdowns
    for (let i = 0; i < this.rowsFormArray.length; i++) {
      if (i !== rowIndex) {
        const rowGroup = this.rowsFormArray.at(i) as FormGroup;
        rowGroup.patchValue({ isDropdownOpen: false });
      }
    }

    // Toggle the dropdown for the clicked row
    const rowGroup = this.rowsFormArray.at(rowIndex) as FormGroup;
    const currentValue = rowGroup.get('isDropdownOpen')?.value || false;
    rowGroup.patchValue({ isDropdownOpen: !currentValue });
    const groupName = this.selectedProductGroup[rowIndex];
    if (groupName == 'Select Group') {
      this.NoProductFound = true;
      this.NoProduct = 'please select Product Name';
      this.productDertailsData = [];
    } else {
      // if group Name is selected
      const matchGroupName = this.productGroupData.find(
        (group: any) => group.productGroupName === groupName
      ); // (Find) return 1st matching element not arrray

      if (matchGroupName.productGroupID) {
        this.getDetailsData(matchGroupName.productGroupID);
      } else {
        //console.log(" group Id not found")
      }
    }
  }

  getDetailsData(productGroupID: number) {
    // console.log("matchGroupName.productGroupID ",productGroupID)
    const userID = localStorage.getItem('code');
    console.log(userID);

    if (productGroupID && userID) {
      this.addProductService
        .GetProductDetailsData(userID, productGroupID)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            //console.log( response)
            this.productDertailsData = response;
            console.log('his.productDertailsData ', this.productDertailsData);
            if (this.productDertailsData.length > 0) {
              this.NoProductFound = false;
            } else {
              this.NoProductFound = true;
            }
          },
          error: (error) => {
            // console.log("error ",error)
            this.productDertailsData = [];
          },
        });
    }
  }
  invisibleProductDropDown(): void {
    const rowsArray = this.rowsFormArray;
    rowsArray.controls.forEach((row) => {
      const rowGroup = row as FormGroup;
      rowGroup.patchValue({ isDropdownOpen: false });
    });
  }

  closeAllDropdownsExcept(index: number) {
    this.rowsFormArray.controls.forEach((control, i) => {
      if (i !== index) {
        const rowGroup = control as FormGroup;
        rowGroup.patchValue({ isDropdownOpen: false });
      }
    });
  }

  getGroupName() {
    this.invisibleProductDropDown();
    const userID = localStorage.getItem('code');
    this.addProductService
      .getProductGroupsByUserId(userID)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          // console.log( response)
          this.productGroupData = response;
          //console.log("his.productDertailsData ",this.productDertailsData)
        },
        error: (error) => {
          //console.log("error ",error)
        },
      });
  }

  filterFunction(event: Event, className: string): void {
    const input = (event.target as HTMLInputElement).value.toUpperCase();
    const links = document.querySelectorAll(
      className
    ) as NodeListOf<HTMLAnchorElement>;

    links.forEach((b: HTMLAnchorElement) => {
      const txtValue = b.textContent || b.innerText || '';
      if (txtValue.toUpperCase().indexOf(input) > -1) {
        b.style.display = '';
      } else {
        b.style.display = 'none';
      }
    });
  }
  onInputBlur() {
    const searchInput = document.getElementById(
      'searchGroupName'
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }
  }
  SetDropDownGroupName(selectedItem: any, rowIndex: number) {
    this.selectedProductGroup[rowIndex] = selectedItem.productGroupName; // Store selected product name for this row

    // reseting the  row if group name is changed
    const row = this.rowsFormArray.at(rowIndex) as FormGroup;
    row.reset();
    // reseting the product name
    this.selectedProductNames[rowIndex] = 'Select Product';
  }

  SetDropDownName(selectedItem: any, rowIndex: number) {
    this.selectedProduct = selectedItem;
    const rowGroup = this.rowsFormArray.at(rowIndex) as FormGroup;
    rowGroup.patchValue({
      productName: selectedItem.productName,
      productId: selectedItem.productId,
      productGroupId: selectedItem.productGroupId,
      specification: selectedItem.specification,
      unit: selectedItem.unit,
      unitId: selectedItem.unitId,
      price: selectedItem.price,
      receiveQty: '',
      availableQty: selectedItem.availableQty,
      remarks: '',
    });

    this.selectedProductNames[rowIndex] = selectedItem.productName; // Store selected product name for this row
    //console.log(" product name ",    this.selectedProductNames)
  }

  getEmptyFields(): string[] {
    const emptyFields: string[] = [];
    // Loop through the form controls or rows in the form array
    const formRows = (this.form.get('rows') as FormArray).controls;
    formRows.forEach((row, index) => {
      const receiveQtyControl = row.get('receiveQty');
      // Check if the receiveQty field is empty or invalid
      if (!receiveQtyControl?.value) {
        emptyFields.push(`Receive Qty in row ${index + 1}`);
      }
      // Check other fields in a similar manner
    });

    return emptyFields;
  }

  clear() {
    this.masterForm.reset(); // Reset the masterForm
    this.form.reset(); // Reset the nested form (rows)
    this.productDertailsData = [];
    this.productGroupData = [];
    while (this.rowsFormArray.length > 0) {
      this.removeRow(0);
      this.selectedProductNames = []; // clearing the  product array
      this.selectedProductGroup = [];
      // console.log("    this.selectedProductGroup",    this.selectedProductGroup)
    }
  }

  rowClicked(index: any, Id: any) {
    this.portalReceivedId = Id;
    //console.log(" i",index)
    this.allQuantyData.forEach((row, i) => {
      row.isSelected = i === index;
    });
  }
  popUpOk() {
    if (this.portalReceivedId) {
      this.getPortalData(this.portalReceivedId);
    }

    if (this.searchInputRef && this.searchInputRef.nativeElement) {
      this.searchInputRef.nativeElement.value = '';
    } else {
      // console.log("error");
    }
  }
}
