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
  selector: 'app-add-groups-modal',
  templateUrl: './add-groups-modal.component.html',
  styleUrls: ['./add-groups-modal.component.css'],
})
export class AddGroupsModalComponent implements AfterViewInit, OnChanges {
  @ViewChild('addGroupModalCenterG') addGroupModalCenterG!: ElementRef;
  @Input() isEdit!: boolean;
  @Input() doubleClickData!: {};
  @Input() IdName!: string;
  @Input() addBtnClick!: boolean;
  @Output() resetFormEvent = new EventEmitter<any>();
  @Output() formDataEvent = new EventEmitter<any>();
  @Output() formSubmitted = new EventEmitter<any>();
  @Output() openModalWithDataEvent = new EventEmitter<any>();

  @ViewChild('productGroupImageInput') ProductImageInput!: ElementRef;
  addGroupForm!: FormGroup;

  imagePathPreview: string = '';
  existingImagePath: string = '';
  private modalInstance: any;

  constructor(
    private addProductService: AddProductService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  ngAfterViewInit(): void {
    this.initializeModal();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isEdit'] && this.isEdit == true) {
      this.initializeModal();
    }
    if (changes['addBtnClick'] && changes['addBtnClick'].currentValue == true) {
      console.log('addBtnClick change detected');
      this.initializeModal();
    }
  }
  initializeForm(): void {
    this.addGroupForm = new FormGroup({
      productGroupName: new FormControl('', Validators.required),
      productGroupImage: new FormControl('', Validators.required),
      productGroupPrefix: new FormControl('', Validators.required),
      productGroupDetails: new FormControl(''),
    });
  }
  initializeModal(): void {
    if (this.addGroupModalCenterG && this.addGroupModalCenterG.nativeElement) {
      const modalElement = this.addGroupModalCenterG.nativeElement;
      this.modalInstance = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
      });

      this.renderer.listen(modalElement, 'shown.bs.modal', () => {
        console.log('Modal is shown');
      });

      this.renderer.listen(modalElement, 'hidden.bs.modal', () => {
        console.log('Modal is hidden');
        this.resetFormEvent.emit();
      });

      if (this.IdName != null) {
        this.modalInstance.show();
        console.log('isEdit', this.isEdit);
        console.log('doubleClickData', this.doubleClickData);
        if (this.isEdit == true) {
          this.updateFormValidators();
          this.populateForm(this.doubleClickData);
        } else {
          // this.addGroupModalCenterG.nativeElement.click();
          this.resetForm();
        }
      }
    } else {
      console.error('addGroupModalCenterG is not defined');
    }
  }

  resetForm(): void {
    console.log('isEdit', this.isEdit);

    this.modalInstance.hide();
    console.log(this.isEdit);
    this.addGroupForm.reset();
    this.isEdit = false;
    this.addBtnClick = false;
  }

  populateForm(group: any): void {
    this.addGroupForm.patchValue({
      productGroupName: group.productGroupName,
      productGroupPrefix: group.productGroupPrefix,
      productGroupDetails: group.productGroupDetails,
    });

    this.displayImage(group.imagepath);
    this.existingImagePath = group.imagepath;
    console.log('ExistingImagePath :', this.existingImagePath);
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
    this.addGroupModalCenterG.nativeElement.click();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.addGroupForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  updateFormValidators(): void {
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
        }
        formData.append(key, value);
      });

      if (this.ProductImageInput.nativeElement.files[0]) {
        formData.append(
          'imageFile',
          this.ProductImageInput.nativeElement.files[0]
        );
      } else if (this.isEdit && this.existingImagePath) {
        formData.append('existingImagePath', this.existingImagePath);
      }

      formData.append('addedBy', 'user');
      formData.append('addedPC', '0.0.0.0');

      for (let pair of (formData as any).entries()) {
        console.log(`${pair[0]}: `, pair[1]);
      }

      this.formDataEvent.emit(formData);
    }
  }
}
