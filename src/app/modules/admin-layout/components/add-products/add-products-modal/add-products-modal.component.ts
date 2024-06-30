import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  Renderer2,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AddProductService } from 'src/app/services/add-product.service';

declare var bootstrap: any;
@Component({
  selector: 'app-add-products-modal',
  templateUrl: './add-products-modal.component.html',
  styleUrls: ['./add-products-modal.component.css'],
})
export class AddProductsModalComponent {
  @ViewChild('addProductModalCenterG') addProductModalCenterG!: ElementRef; // Reference to the modal element
  @Input() isEdit!: boolean; // Indicates if the form is in edit mode
  @Input() doubleClickData!: {}; // Data passed when an item is double clicked for editing
  @Input() IdName!: string; // Unique identifier for the modal
  @Input() addBtnClick!: boolean; // Indicates if the add button was clicked
  @Input() productGroups!: any;
  @Input() brands!: any;
  @Input() units!: any;
  @Output() resetFormEvent = new EventEmitter<any>(); // Event emitted when the form is reset
  @Output() formDataEvent = new EventEmitter<any>(); // Event emitted with form data on form submission
  @Output() formSubmitted = new EventEmitter<any>(); // Event emitted when the form is submitted
  @Output() openModalWithDataEvent = new EventEmitter<any>(); // Event emitted when the modal is opened with data

  @ViewChild('ProductImageInput') ProductImageInput!: ElementRef; // Reference to the file input element
  addProductForm!: FormGroup; // Form group for the modal

  imagePathPreview: string = ''; // Image preview path
  existingImagePath: string = ''; // Path to the existing image
  private modalInstance: any; // Bootstrap modal instance

  constructor(
    private addProductService: AddProductService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initializeForm(); // Initialize the form on component initialization
    // console.log(this.units);
  }

  ngAfterViewInit(): void {
    this.initializeModal(); // Initialize the modal after the view is initialized
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Handle input property changes
    if (changes['isEdit'] && this.isEdit === true) {
      this.initializeModal(); // Reinitialize the modal if in edit mode
    }
    if (
      changes['addBtnClick'] &&
      changes['addBtnClick'].currentValue === true
    ) {
      this.initializeModal(); // Reinitialize the modal if the add button was clicked
    }
  }

  initializeForm(): void {
    // Initialize the form group with controls and validators
    this.addProductForm = new FormGroup({
      productGroupID: new FormControl('', Validators.required),
      productName: new FormControl('', Validators.required),
      productSubName: new FormControl(''),
      specification: new FormControl('', Validators.required),
      brandId: new FormControl('', Validators.required),
      unitId: new FormControl('', Validators.required),
      productImage: new FormControl('', Validators.required),
    });
  }

  initializeModal(): void {
    // Initialize the modal if the modal element is defined
    if (
      this.addProductModalCenterG &&
      this.addProductModalCenterG.nativeElement
    ) {
      const modalElement = this.addProductModalCenterG.nativeElement;
      this.createModalInstance(modalElement);
      this.attachModalEventListeners(modalElement);
      this.handleModalDisplay();
    } else {
      // console.error('addGroupModalCenterG is not defined');
    }
  }

  createModalInstance(modalElement: any): void {
    // Create a new Bootstrap modal instance
    this.modalInstance = new bootstrap.Modal(modalElement, {
      backdrop: 'static',
    });
  }

  attachModalEventListeners(modalElement: any): void {
    // Attach event listeners to the modal for showing and hiding events
    this.renderer.listen(modalElement, 'shown.bs.modal', () => {
      // console.log('Modal is shown');
    });

    this.renderer.listen(modalElement, 'hidden.bs.modal', () => {
      // console.log('Modal is hidden');
      this.resetFormEvent.emit(); // Emit event when the modal is hidden
    });
  }

  handleModalDisplay(): void {
    // Display the modal if the IdName is not null
    if (this.IdName != null) {
      this.modalInstance.show();
      // console.log('isEdit', this.isEdit);
      // console.log('doubleClickData', this.doubleClickData);
      if (this.isEdit) {
        this.updateFormValidators(); // Update form validators in edit mode
        this.populateForm(this.doubleClickData); // Populate the form with data
      } else {
        this.resetForm(); // Reset the form if not in edit mode
      }
    }
  }

  resetForm(): void {
    // Reset the form and hide the modal
    // console.log('isEdit', this.isEdit);
    this.modalInstance.hide();
    // console.log(this.isEdit);
    this.addProductForm.reset();
    this.isEdit = false;
    this.addBtnClick = false;
  }

  populateForm(product: any): void {
    // Populate the form with the provided data
    this.addProductForm.patchValue({
      productGroupID: product.productGroupID,
      productName: product.productName,
      productSubName: product.productSubName,
      specification: product.specification,
      unitId: product.unitId,
      brandId: product.brandId,
    });

    this.displayImage(product.imagePath); // Display the image
    this.existingImagePath = product.imagePath;
    // console.log('ExistingImagePath :', this.existingImagePath);
  }

  displayImage(imagePath: string): void {
    // Display the image preview
    // console.log('imagePath:', imagePath);
    if (imagePath) {
      const imageUrl = '/asset' + imagePath.split('asset')[1];
      this.imagePathPreview = imageUrl;
      // console.log('imagePathPreview :', this.imagePathPreview);
    } else {
      this.imagePathPreview = 'not upload yet';
    }
    this.addProductModalCenterG.nativeElement.click();
  }

  isFieldInvalid(fieldName: string): boolean {
    // Check if a form field is invalid

    const field = this.addProductForm.get(fieldName);
    // console.log(field);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  updateFormValidators(): void {
    // Update the form validators based on the edit mode
    const productGroupImageControl = this.addProductForm.get('productImage');
    if (productGroupImageControl) {
      if (this.isEdit) {
        productGroupImageControl.clearValidators();
      } else {
        productGroupImageControl.setValidators(Validators.required);
      }
      productGroupImageControl.updateValueAndValidity();
    }
  }

  onSubmit() {
    // Handle form submission
    Object.values(this.addProductForm.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
    });

    if (this.addProductForm.valid) {
      const formData = this.prepareFormData();
      this.formDataEvent.emit(formData); // Emit event with form data
    }
  }

  prepareFormData(): FormData {
    // Prepare form data for submission
    // console.log('Form Data:', this.addProductForm.value);
    const formData = new FormData();

    this.appendFormValues(formData); // Append form values to form data
    this.appendImageFile(formData); // Append image file to form data
    this.appendAdditionalData(formData); // Append additional data to form data
    this.logFormData(formData); // Log form data

    return formData;
  }

  appendFormValues(formData: FormData) {
    // Append form values to form data
    Object.keys(this.addProductForm.value).forEach((key) => {
      let value = this.addProductForm.value[key];
      if (key === 'productId') {
        value = String(Math.floor(Number(value)));
      }
      formData.append(key, value);
    });
  }

  appendImageFile(formData: FormData) {
    // Append image file to form data if available
    if (this.ProductImageInput.nativeElement.files[0]) {
      formData.append(
        'imageFile',
        this.ProductImageInput.nativeElement.files[0]
      );
    } else if (this.isEdit && this.existingImagePath) {
      formData.append('existingImagePath', this.existingImagePath);
    }
  }

  appendAdditionalData(formData: FormData) {
    // Append additional data to form data
    formData.append('addedBy', 'user');
    formData.append('addedPC', '0.0.0.0');
  }

  logFormData(formData: FormData) {
    // Log form data to the console
    for (let pair of (formData as any).entries()) {
      console.log(`${pair[0]}: `, pair[1]);
    }
  }
}
