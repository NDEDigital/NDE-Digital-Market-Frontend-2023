import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormBuilder,
} from '@angular/forms';

import { Subject, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddProductService } from 'src/app/services/add-product.service';
import { GoodsDataService } from 'src/app/services/goods-data.service';
import { ProductFormService } from 'src/app/services/product-discount-form-service.service';
import { DestroyRef } from '@angular/core';
@Component({
  selector: 'app-add-price-discounts',
  templateUrl: './add-price-discounts.component.html',
  styleUrls: ['./add-price-discounts.component.css'],
})
export class AddPriceDiscountsComponent {
  @ViewChild('ProductImageInput') ProductImageInput!: ElementRef;
  @ViewChild('prdouctExistModalBTN') PrdouctExistModalBTN!: ElementRef;
  @ViewChild('addGroupModalCenterG') AddGroupModalCenterG!: ElementRef;
  @ViewChild('groupSelect') groupSelect!: ElementRef;
  @ViewChild('productSelect') productSelect!: ElementRef;
  addPriceDiscountForm!: FormGroup;
  products: any[] = [];
  isDisabled: boolean = true;
  alertMsg: string = '';
  isError: boolean = false;
  showPriceProductDiv: boolean = false;
  productList: any;
  btnIndex = -1;
  selectedUnitName = '';
  isEditMode = false;
  currentProductPrice: any = null;
  activeProductPriceId: number | null = null;
  existingImagePath: string = '';
  imagePathPreview: string = '';

  selectedGroup: any = null;
  selectedGroupId: any = null;

  allGroupData: any[] = [];
  filteredProducts: any[] = [];
  selectedProduct: any;
  allProducts: any[] = [];
  allProductAndGroup: any[] = [];
  isHovered: any | null = null;

  constructor(
    private productFormService: ProductFormService,
    private productService: AddProductService,
    private goodsService: GoodsDataService,
    protected destroyRef: DestroyRef
  ) {}

  /**
   * Angular lifecycle hook called after component initialization.
   * Initializes the form, retrieves products and group data, and sets up form value changes.
   */
  ngOnInit() {
    this.addPriceDiscountForm = this.productFormService.createForm();
    this.getProducts(-1);
    this.setupFormValueChanges();
    this.getGroupList();
    this.addPriceDiscountForm.get('productId')?.setValue(null);
  }
  /**
   * Handles changes in the selected product.
   * @param event Event containing the selected product value.
   */
  onProductChange(event: any) {
    const productId = event.target.value;
    const selectedProduct = this.products.find(
      (prod) => prod.productId == productId
    );
    this.selectedUnitName = selectedProduct ? selectedProduct.unitName : '';
  }
  /**
   * Checks if a discount amount or percentage is entered.
   * @returns True if discount amount or percentage is entered, false otherwise.
   */
  isDiscountEntered(): boolean {
    const discountAmount = parseFloat(
      this.addPriceDiscountForm.get('discountAmount')?.value
    );
    const discountPct = parseFloat(
      this.addPriceDiscountForm.get('discountPct')?.value
    );

    return (
      (!isNaN(discountAmount) && discountAmount > 0) ||
      (!isNaN(discountPct) && discountPct > 0)
    );
  }
  /**
   * Toggles the visibility of the add product price section.
   */
  toggleAddProductPriceDiv(): void {
    this.showPriceProductDiv = !this.showPriceProductDiv;
    this.addPriceDiscountForm.reset();
    this.btnIndex = -1;
    this.getProducts(-1);
  }

  /**
   * Retrieves products based on status.
   * @param status Status of the products to retrieve.
   */
  getProducts(status: any) {
    let userID = localStorage.getItem('code');
    this.productService
      .GetProductsByStatus(userID, status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.productList = response;
          console.log(response);
        },
        error: (error: any) => {
          console.log(error);
          this.alertMsg = error.error.message;
        },
      });
  }

  showProductPriceGrid(): void {
    this.showPriceProductDiv = false;
  }

  onGroupChange(event: any) {
    const selectedGroupId = event.target.value;
    this.selectedProduct = null;
    this.selectedUnitName = '';
    if (this.addPriceDiscountForm.get('productId')) {
      this.addPriceDiscountForm.get('productId')?.setValue(null);
    }
    this.getProductData(selectedGroupId);
  }

  getProductData(GroupID: string) {
    this.productService
      .GetProductByGroupName(GroupID)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.allProductAndGroup = response;
          this.products = [...this.allProductAndGroup];
          console.log(response);
        },
        error: (error: any) => {
          this.products = [];
          this.alertMsg = error.error.message;
        },
      });
  }
  /**
   * Checks if a form field is invalid.
   * @param fieldName Name of the form field to check.
   * @returns True if the field is invalid, false otherwise.
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.addPriceDiscountForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
  /**
   * Opens the modal to add a new group.
   */
  openAddGroupModal(): void {
    this.resetForm();
    this.isEditMode = false;
    this.currentProductPrice = null;
    this.AddGroupModalCenterG.nativeElement.click();
  }
  /**
   * Retrieves the list of groups.
   */
  getGroupList() {
    this.goodsService
      .getGroupData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: any[]) => {
        this.allGroupData = data;
        console.log(data);
      });
  }
  /**
   * Resets the form and clears the selected unit name and product data.
   */
  resetForm(): void {
    this.addPriceDiscountForm.reset();
    this.selectedUnitName = '';
    this.isEditMode = false;
    this.currentProductPrice = null;
    this.activeProductPriceId = null;
    this.groupSelect.nativeElement.value = null;
    this.products = [];
  }

  setupFormValueChanges() {
    const form = this.addPriceDiscountForm;
    const priceControl = form.get('price');
    const discountAmountControl = form.get('discountAmount');
    const discountPctControl = form.get('discountPct');

    discountAmountControl?.valueChanges.subscribe((value) => {
      this.calculateDiscountPct(value);
      this.calculateTotalPrice();
    });

    discountPctControl?.valueChanges.subscribe((value) => {
      this.calculateDiscountAmount(value);
      this.calculateTotalPrice();
    });

    priceControl?.valueChanges.subscribe((value) => {
      if (value) {
        discountPctControl?.setValue('0', { emitEvent: false });
        discountAmountControl?.setValue('0', { emitEvent: false });
      }
      this.calculateTotalPrice();
    });

    discountAmountControl?.valueChanges.subscribe(() => {
      this.updateDateFieldValidators();
    });

    discountPctControl?.valueChanges.subscribe(() => {
      this.updateDateFieldValidators();
    });

    priceControl?.valueChanges.subscribe(() => {
      this.updateDateFieldValidators();
    });
  }

  calculateTotalPrice() {
    const price = parseFloat(this.addPriceDiscountForm.get('price')?.value);
    const discountAmount = parseFloat(
      this.addPriceDiscountForm.get('discountAmount')?.value
    );
    const discountPct = parseFloat(
      this.addPriceDiscountForm.get('discountPct')?.value
    );

    let totalPrice = price;

    if (this.isDiscountEntered()) {
      totalPrice = price;
      if (!isNaN(discountAmount) && discountAmount > 0) {
        totalPrice -= discountAmount;
      }
      if (!isNaN(discountPct) && discountPct > 0) {
        totalPrice -= price * (discountPct / 100);
      }
    }

    this.addPriceDiscountForm
      .get('totalPrice')
      ?.setValue(totalPrice.toFixed(2));
  }

  calculateDiscountPct(discountAmount: string) {
    const price = parseFloat(this.addPriceDiscountForm.get('price')?.value);
    if (price > 0 && !isNaN(parseFloat(discountAmount))) {
      const discountPct = (parseFloat(discountAmount) / price) * 100;
      this.addPriceDiscountForm
        .get('discountPct')
        ?.setValue(discountPct.toFixed(2), { emitEvent: false });
    }
  }

  calculateDiscountAmount(discountPct: string) {
    const price = parseFloat(this.addPriceDiscountForm.get('price')?.value);
    if (price > 0 && !isNaN(parseFloat(discountPct))) {
      const discountAmount = (parseFloat(discountPct) / 100) * price;
      this.addPriceDiscountForm
        .get('discountAmount')
        ?.setValue(discountAmount.toFixed(2), { emitEvent: false });
    }
  }

  updateDateFieldValidators() {
    const effectiveDateControl =
      this.addPriceDiscountForm.get('effectivateDate');
    const endDateControl = this.addPriceDiscountForm.get('endDate');
    const discountEntered = this.isDiscountEntered();

    if (discountEntered) {
      effectiveDateControl?.setValidators([
        Validators.required,
        this.productFormService.presentOrFutureDateValidator(),
      ]);
      if (effectiveDateControl?.value) {
        const effectiveDate = new Date(effectiveDateControl.value);
        endDateControl?.setValidators([
          Validators.required,
          this.productFormService.futureDateValidator(effectiveDate),
        ]);
      }
    } else {
      effectiveDateControl?.clearValidators();
      endDateControl?.clearValidators();
    }

    effectiveDateControl?.updateValueAndValidity();
    endDateControl?.updateValueAndValidity();
  }

  onProductImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePathPreview = e.target.result;
      };
      reader.readAsDataURL(file);
      this.addPriceDiscountForm.patchValue({ productImage: file });
    }
  }

  onSubmit(): void {
    this.markControlsAsTouchedAndDirty();

    if (this.addPriceDiscountForm.valid) {
      const formData = this.createFormData();

      if (!this.isEditMode) {
        this.createProductPrice(formData);
      } else {
        this.updateProductPrice(formData);
      }
    } else {
      console.log('Form is not valid');
    }
  }
  private markControlsAsTouchedAndDirty(): void {
    Object.values(this.addPriceDiscountForm.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
    });
  }
  private createFormData(): FormData {
    const formData = new FormData();

    Object.keys(this.addPriceDiscountForm.value).forEach((key) => {
      let value = this.addPriceDiscountForm.value[key];

      if (key === 'discountAmount' || key === 'discountPct') {
        value =
          value === '' || isNaN(parseFloat(value)) || parseFloat(value) === 0
            ? '0.00'
            : parseFloat(value).toFixed(2);
      } else if (key === 'effectivateDate' || key === 'endDate') {
        value = value || '';
      } else if (key === 'productId' || key === 'userId') {
        value = String(Math.floor(Number(value)));
      } else if (key === 'price') {
        value = parseFloat(value).toFixed(2);
      }

      formData.append(key, value);
    });

    formData.append('imageFile', this.ProductImageInput.nativeElement.files[0]);
    formData.append('addedBy', 'user');
    formData.append('addedPC', '0.0.0.0');

    let userID = localStorage.getItem('code');
    if (userID) {
      formData.append('userId', userID);
    }
    formData.append('companyCode', 'companyCode');

    return formData;
  }
  private createProductPrice(formData: FormData) {
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    let apiCall = this.productService.createSellerProductPrice(formData);
    this.handleApi(apiCall, 'Product price created successfully.');
  }
  private updateProductPrice(formData: FormData) {
    let updateByUser = localStorage.getItem('code');
    if (updateByUser !== null) {
      formData.append('UpdatedBy', updateByUser);
    }
    formData.append('UpdatedPC', '0.0.0.0');

    let apiCall = this.productService.updateSellerProductPrice(formData);
    this.handleApi(apiCall, 'Product price updated successfully.');
  }

  private handleSuccess(message: string): void {
    this.alertMsg = message;
    this.isEditMode = false;
    this.isError = false;
    this.addPriceDiscountForm.reset();
    this.getProducts(-1);
    this.btnIndex = -1;
    this.PrdouctExistModalBTN.nativeElement.click();
  }
  private handleError(message: string): void {
    this.alertMsg = message;
    this.isError = true;
    this.isEditMode = false;
    this.addPriceDiscountForm.reset();
    this.getProducts(-1);
    this.btnIndex = -1;
    this.PrdouctExistModalBTN.nativeElement.click();
  }

  updateFormValidators(): void {
    // Check if the control exists
    const productGroupImageControl =
      this.addPriceDiscountForm.get('productImage');
    if (productGroupImageControl) {
      if (this.isEditMode) {
        productGroupImageControl.clearValidators();
      } else {
        productGroupImageControl.setValidators(Validators.required);
      }
      productGroupImageControl.updateValueAndValidity();
    }
  }

  openModalWithData(product: any): void {
    this.isEditMode = true;
    this.updateFormValidators();
    console.log('product', product);

    this.getProductData(product.productGroupID);

    this.populateForm(product);
    this.currentProductPrice = product;

    this.displayImage(product.imagePath);
    this.activeProductPriceId = product.productId;
  }

  populateForm(product: any): void {
    const isDefaultDate = (date: string) =>
      date.startsWith('0001-01-01T00:00:00');
    this.addPriceDiscountForm.patchValue({
      productId: product.productId,
      price: product.price,
      discountAmount: product.discountAmount,
      discountPct: product.discountPct,
      // effectivateDate: product.effectivateDate,
      // endDate: product.endDate,
      effectivateDate: isDefaultDate(product.effectivateDate)
        ? null
        : product.effectivateDate,
      endDate: isDefaultDate(product.endDate) ? null : product.endDate,
      totalPrice: product.totalPrice,
    });

    // console.log('product price:  ', product.discountAmount);

    this.displayImage(product.imagePath);
    this.existingImagePath = product.imagepath;
    this.selectedUnitName = product.unitName;
    this.groupSelect.nativeElement.value = product.productGroupID;
    this.productSelect.nativeElement.value = product.productId;
  }

  displayImage(imagePath: string): void {
    if (imagePath) {
      const imageUrl = '/asset' + imagePath.split('asset')[1];

      this.imagePathPreview = imageUrl;
    } else {
      this.imagePathPreview = 'not upload yet';
    }
    this.AddGroupModalCenterG.nativeElement.click();
  }

  handleApi(apiCall: Observable<any>, successMessage?: string) {
    apiCall.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response: any) => {
        if (successMessage) {
          this.handleSuccess(successMessage);
        }
      },
      error: (error: any) => {
        this.handleError(error.error.message);
      },
    });
  }
}
