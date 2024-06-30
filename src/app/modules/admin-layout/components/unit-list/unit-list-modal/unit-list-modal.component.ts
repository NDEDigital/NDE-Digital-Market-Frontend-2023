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

declare var bootstrap: any;
@Component({
  selector: 'app-unit-list-modal',
  templateUrl: './unit-list-modal.component.html',
  styleUrls: ['./unit-list-modal.component.css'],
})
export class UnitListModalComponent implements AfterViewInit, OnChanges {
  @Input() isEdit!: boolean;
  addGroupForm!: FormGroup; // Form group for the modal
  @ViewChild('addGroupModalCenterG') addGroupModalCenterG!: ElementRef;
  @Output() resetFormEvent = new EventEmitter<any>(); // Event emitted when the form is reset
  @Input() doubleClickData!: {}; // Data passed when an item is double clicked for editing
  @Input() addBtnClick!: boolean; // Indicates if the add button was clicked
  @Output() formDataEvent = new EventEmitter<any>(); // Event emitted with form data on form submission
  @Input() IdName!: string; // Unique identifier for the modal
  private modalInstance: any; // Bootstrap modal instance

  constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.initializeForm(); // Initialize the form on component initialization
  }

  ngAfterViewInit(): void {
    this.initializeModal(); // Initialize the modal after the view is initialized
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('eikhane e ki??');
    // Handle input property changes
    if (changes['isEdit'] && this.isEdit === true) {
      console.log('eikhane e ki 1');
      this.initializeModal(); // Reinitialize the modal if in edit mode
    }
    if (
      changes['addBtnClick'] &&
      changes['addBtnClick'].currentValue === true
    ) {
      console.log('eikhane e ki 2');
      this.initializeModal(); // Reinitialize the modal if the add button was clicked
    }
  }

  initializeForm(): void {
    this.addGroupForm = new FormGroup({
      description: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
    });
  }

  initializeModal(): void {
    // Initialize the modal if the modal element is defined
    if (this.addGroupModalCenterG && this.addGroupModalCenterG.nativeElement) {
      const modalElement = this.addGroupModalCenterG.nativeElement;
      this.createModalInstance(modalElement);
      this.attachModalEventListeners(modalElement);
      this.handleModalDisplay();
    } else {
      console.error('addGroupModalCenterG is not defined');
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
      console.log('Modal is shown');
    });

    this.renderer.listen(modalElement, 'hidden.bs.modal', () => {
      console.log('Modal is hidden');
      this.resetFormEvent.emit(); // Emit event when the modal is hidden
    });
  }

  handleModalDisplay(): void {
    // Display the modal if the IdName is not null
    if (this.IdName != null) {
      this.modalInstance.show();
      console.log('isEdit', this.isEdit);
      console.log('doubleClickData', this.doubleClickData);
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
    console.log('isEdit', this.isEdit);
    this.modalInstance.hide();
    console.log(this.isEdit);
    this.addGroupForm.reset();
    this.isEdit = false;
    this.addBtnClick = false;
  }

  populateForm(group: any): void {
    // Populate the form with the provided data
    this.addGroupForm.patchValue({
      description: group.description,
      name: group.name,
      productGroupDetails: group.productGroupDetails,
    });
    this.addGroupModalCenterG.nativeElement.click();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.addGroupForm.get(fieldName);
    // Check if the field is not null before accessing its properties
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  updateFormValidators(): void {
    // Update the form validators based on the edit mode
    const productGroupImageControl = this.addGroupForm.get('productGroupImage');
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
    Object.values(this.addGroupForm.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
    });

    if (this.addGroupForm.valid) {
      const formData = this.prepareFormData();
      this.formDataEvent.emit(formData); // Emit event with form data
    }
  }

  prepareFormData(): FormData {
    // Prepare form data for submission
    console.log('Form Data:', this.addGroupForm.value);
    const formData = new FormData();

    this.appendFormValues(formData); // Append form values to form data
    this.appendAdditionalData(formData); // Append additional data to form data
    this.logFormData(formData); // Log form data

    return formData;
  }

  appendFormValues(formData: FormData) {
    // Append form values to form data
    Object.keys(this.addGroupForm.value).forEach((key) => {
      let value = this.addGroupForm.value[key];
      if (key === 'productId' ) {
        value = String(Math.floor(Number(value)));
        console.log(value);
      }
      formData.append(key, value);
    });
  }

  appendAdditionalData(formData: FormData) {
    // Append additional data to form data
    formData.append('addedBy', 'admin');
    formData.append('addedPC', '0.0.0.0');
  }

  logFormData(formData: FormData) {
    // Log form data to the console
    for (let pair of (formData as any).entries()) {
      console.log(`${pair[0]}: `, pair[1]);
    }
  }
}
