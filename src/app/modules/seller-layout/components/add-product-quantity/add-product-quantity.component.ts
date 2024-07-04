import {
  FormGroup,
  Validators,
  FormBuilder,
  FormArray,
  AbstractControl,
} from '@angular/forms';
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
  @ViewChild('modalTrigger') modalTrigger!: ElementRef;

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
  constructor(
    private destroyRef: DestroyRef,
    private fb: FormBuilder,
    private addProductService: AddProductService
  ) {
    // Initializing the main form
    this.masterForm = this.fb.group({
      portalReceivedCode: [''],
      portalReceivedDate: [''],
      challanNo: ['', Validators.required],
      challanDate: ['', Validators.required],
      remarks: [''],
    });
    // Initializing the form for rows
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });
  }

  ngOnInit() {}

  /**
   * Retrieves the user ID from local storage
   */
  getUserId() {
    return localStorage.getItem('code');
  }

  /**
   * Creates a new form group for a row
   */
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

  /**
   * Fetches the quantity data by user ID
   */
  GetAddQuantityDataByUserId() {
    this.clearSearchInput();
    this.addProductService
      .GetAddQuantityDataByUserId(this.getUserId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => (this.allQuantyData = response),
        error: (error) => console.error('Error:', error),
      });
  }

  get rowsFormArray(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  /**
   * Adds a new row to the form
   */

  addRow() {
    if (this.receivedCode.nativeElement.value) this.clear();

    if (this.checkAllRowsValidity()) {
      // if(this.rowsFormArray.length ==0 )
      //   console.log(this.rowsFormArray.length)
      this.rowsFormArray.push(this.createRowGroup());
      this.selectedProductNames.push('Select Product');
      this.selectedProductGroup.push('Select Group');
    } else {
      this.modalTrigger.nativeElement.click();
    }
  }

/**
 * checking allRows validation
*/
  checkAllRowsValidity(): boolean {
    let isValid = true;
    this.rowsFormArray.controls.forEach(
      (control: AbstractControl, index: number) => {
        const rowGroup = control as FormGroup;
        const receiveQtyControl = rowGroup.get('receiveQty');
        const priceControl = rowGroup.get('price');

        if (!priceControl || priceControl.invalid) {
          priceControl?.markAsTouched();
          isValid = false;
        }

        if (!receiveQtyControl || receiveQtyControl.invalid) {
          receiveQtyControl?.markAsTouched();
          isValid = false;
        }
      }
    );
    return isValid;
  }

  /**
   * Fetches portal data based on the received ID
   */
  getPortalData(PortalReceivedId: any) {
    this.addProductService
      .GetPortalData(PortalReceivedId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => this.PatchForm(response),
        error: (error) => console.error('Error:', error),
      });
  }

  /**
   * Removes a row from the form at the specified index
   */
  removeRow(index: number) {
    this.rowsFormArray.removeAt(index);
    this.selectedProductNames.splice(index, 1);
    this.selectedProductGroup.splice(index, 1);
  }

  /**
   * Logs the form value on submit
   */
  onSubmit() {
    console.log(this.form.value);
  }

  /**
   * Checks if the form is valid
   */
  isFormValid(): boolean {
    return this.form.valid;
  }

  /**
   * Submits the form data
   */
  submit() {
    if (this.isFormValid() && this.rowsFormArray.length) {
      this.preparePortalData();
      console.log(this.portaldata);
      this.addProductService
        .insertPortalReceived(this.portaldata)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => this.handleSuccessfulSubmit(response),
          error: (error) => console.error('Error:', error),
        });
    } else {
      console.log('Form is invalid');
    }
  }

  /**
   * Sets the receive quantity field to read-only if there is a received code
   */
  private setIsReceiveQtyReadOnly(): void {
    this.isReceiveQtyReadOnly = !!this.receivedCode.nativeElement.value;
  }

  /**
   * Patches the main form values with the given data
   */
  private patchMainFormValues(data: any): void {
    this.masterForm.patchValue({
      challanNo: data.challanNo,
      remarks: data.remarks,
      portalReceivedCode: data.portalReceivedCode,
      portalReceivedDate: data.materialReceivedDate
        ? data.materialReceivedDate.split('T')[0]
        : null,
      challanDate: data.challanDate ? data.challanDate.split('T')[0] : null,
    });
  }

  /**
   * Clears and sets the form array with the given data
   */
  private clearAndSetFormArray(data: any): void {
    const detailsFormArray = this.rowsFormArray;
    detailsFormArray.clear();
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
    });
  }

  /**
   * Handles the selected products for the given data
   */
  private handleSelectedProducts(data: any): void {
    this.selectedProductGroup = [];
    this.selectedProductNames = [];
    data.portalReceivedDetailAfterInsertlList.forEach((detail: any) => {
      this.selectedProductNames.push(detail.productName);
      this.selectedProductGroup.push(detail.productGroupName);
    });
  }

  /**
   * Patches the form with the given data
   */
  PatchForm(data: any): void {
    this.setIsReceiveQtyReadOnly();
    this.patchMainFormValues(data);
    this.clearAndSetFormArray(data);
    this.handleSelectedProducts(data);
  }

  /**
   * Checks if the dropdown is visible for the given row index
   */
  isDropdownVisible(rowIndex: number): boolean {
    this.productdropDownIndex = rowIndex;
    const rowGroup = this.rowsFormArray.at(rowIndex) as FormGroup;
    return rowGroup.get('isDropdownOpen')?.value === true;
  }

  /**
   * Toggles the dropdown for the given row index
   */
  toggleDropdown(rowIndex: number): void {
    console.log('ashce');
    this.closeAllDropdownsExcept(rowIndex);
    const rowGroup = this.rowsFormArray.at(rowIndex) as FormGroup;
    rowGroup.patchValue({
      isDropdownOpen: !rowGroup.get('isDropdownOpen')?.value,
    });
    this.handleDropdownToggle(rowIndex);
  }

  /**
   * Fetches the details data for the given product group ID
   */
  getDetailsData(productGroupID: number) {
    if (productGroupID && this.getUserId()) {
      this.addProductService
        .GetProductDetailsData(this.getUserId(), productGroupID)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => this.handleProductDetailsResponse(response),
          error: (error) => (this.productDertailsData = []),
        });
    }
  }

  /**
   * Makes the product dropdown invisible
   */
  invisibleProductDropDown(): void {
    this.rowsFormArray.controls.forEach((row) => {
      (row as FormGroup).patchValue({ isDropdownOpen: false });
    });
  }

  /**
   * Closes all dropdowns except the one at the given index
   */
  closeAllDropdownsExcept(index: number) {
    this.rowsFormArray.controls.forEach((control, i) => {
      if (i !== index)
        (control as FormGroup).patchValue({ isDropdownOpen: false });
    });
  }

  /**
   * Fetches the group names
   */
  getGroupName() {
    this.invisibleProductDropDown();
    this.addProductService
      .getProductGroupsByUserId(this.getUserId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => (this.productGroupData = response),
        error: (error) => console.error('Error:', error),
      });
  }

  /**
   * Filters the dropdown based on the input event and class name
   */
  filterFunction(event: Event, className: string): void {
    const input = (event.target as HTMLInputElement).value.toUpperCase();
    document.querySelectorAll(className).forEach((element: Element) => {
      const anchor = element as HTMLAnchorElement;
      anchor.style.display = anchor.textContent?.toUpperCase().includes(input)
        ? ''
        : 'none';
    });
  }

  /**
   * Clears the input field on blur event
   */
  onInputBlur() {
    const searchInput = document.getElementById(
      'searchGroupName'
    ) as HTMLInputElement;
    if (searchInput) searchInput.value = '';
  }

  /**
   * Sets the selected group name for the dropdown
   */
  SetDropDownGroupName(selectedItem: any, rowIndex: number) {
    this.selectedProductGroup[rowIndex] = selectedItem.productGroupName;
    const row = this.rowsFormArray.at(rowIndex) as FormGroup;
    row.reset();
    this.selectedProductNames[rowIndex] = 'Select Product';
  }

  /**
   * Sets the selected product name for the dropdown
   */
  SetDropDownName(selectedItem: any, rowIndex: number) {
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
    this.selectedProductNames[rowIndex] = selectedItem.productName;
  }

  /**
   * Retrieves empty fields from the form
   */
  getEmptyFields(): string[] {
    return (this.form.get('rows') as FormArray).controls.reduce(
      (emptyFields: string[], row, index) => {
        if (!row.get('receiveQty')?.value)
          emptyFields.push(`Receive Qty in row ${index + 1}`);
        return emptyFields;
      },
      []
    );
  }

  /**
   * Clears the form and resets all fields
   */
  clear() {
    this.masterForm.reset();
    this.form.reset();
    this.productDertailsData = [];
    this.productGroupData = [];
    this.rowsFormArray.clear();
    this.selectedProductNames = [];
    this.selectedProductGroup = [];
  }

  /**
   * Handles the row click event
   */
  rowClicked(index: any, Id: any) {
    this.portalReceivedId = Id;
    this.allQuantyData.forEach((row, i) => (row.isSelected = i === index));
  }

  /**
   * Handles the OK button click event in the popup
   */
  popUpOk() {
    if (this.portalReceivedId) this.getPortalData(this.portalReceivedId);
    this.clearSearchInput();
  }

  /**
   * Clears the search input field
   */
  private clearSearchInput() {
    if (this.searchInputRef && this.searchInputRef.nativeElement) {
      this.searchInputRef.nativeElement.value = '';
    }
  }

  /**
   * Checks the validity of the last row in the form
   */
  private checkLastRowValidity() {
    const rowsArray = this.rowsFormArray;
    if (rowsArray.length > 0 && !rowsArray.at(rowsArray.length - 1).valid) {
      console.log('Invalid row');
    }
    this.invisibleProductDropDown();
  }

  /**
   * Prepares the portal data for submission
   */
  private preparePortalData() {
    const formData = this.form.value;
    this.portaldata = {
      challanNo: this.masterForm.value.challanNo,
      remarks: this.masterForm.value.remarks,
      userId: this.getUserId(),
      // companyCode: 'CMP-23-0009',
      addedBy: 'string',
      addedPC: 'string',
      portalReceivedDetailslist: formData.rows.map((row: any) => ({
        productGroupId: row.productId,
        productId: row.productId,
        specification: row.specification,
        receivedQty: parseInt(row.receiveQty, 10),
        unitId: row.unitId,
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
  }

  /**
   * Handles successful submission of the form
   */
  private handleSuccessfulSubmit(response: any) {
    console.log(response);
    this.masterForm.reset();
    this.form.reset();
    this.selectedProductNames = [];
    this.selectedProductGroup = [];
    console.log(response, 'this ache na');
    this.getPortalData(response.id);
  }

  /**
   * Handles the toggle of the dropdown for the specified row index
   */
  private handleDropdownToggle(rowIndex: number) {
    const groupName = this.selectedProductGroup[rowIndex];
    if (groupName == 'Select Group') {
      this.NoProductFound = true;
      this.NoProduct = 'please select Product Name';
      this.productDertailsData = [];
    } else {
      const matchGroupName = this.productGroupData.find(
        (group: any) => group.productGroupName === groupName
      );
      if (matchGroupName.productGroupID) {
        this.getDetailsData(matchGroupName.productGroupID);
      }
    }
  }

  /**
   * Handles the response for product details
   */
  private handleProductDetailsResponse(response: any) {
    console.log(response);
    this.productDertailsData = response;
    this.NoProductFound = this.productDertailsData.length === 0;
  }
}
