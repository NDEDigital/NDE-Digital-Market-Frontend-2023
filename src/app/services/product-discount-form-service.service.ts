import { Injectable } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormBuilder,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ProductFormService {
  constructor(private fb: FormBuilder) {}

  createForm(): FormGroup {
    return this.fb.group({
      productId: ['', Validators.required],
      price: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d*\.?\d+$/),
          this.nonNegativeNumberValidator(),
        ],
      ],
      discountAmount: [
        '',
        [Validators.pattern(/^\d*\.?\d+$/), this.nonNegativeNumberValidator()],
      ],
      discountPct: [
        '0.00',
        [
          Validators.pattern(/^\d*\.?\d+$/),
          this.nonNegativeNumberValidator(),
          this.maxDiscountPctValidator(),
        ],
      ],
      // effectivateDate: [''],
      effectivateDate: [null, Validators.required],
      endDate: [''],
      productImage: ['', Validators.required],
      totalPrice: [''],
    });
  }

  nonNegativeNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value !== null && !isNaN(value) && value >= 0
        ? null
        : { nonNegativeNumber: true };
    };
  }

  maxDiscountPctValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || control.value === '') {
        return null;
      }
      const discountPct = parseFloat(control.value);
      return discountPct >= 0 && discountPct <= 100
        ? null
        : { maxDiscountPct: true };
    };
  }

  presentOrFutureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      // console.log(selectedDate, "date selected");

      return selectedDate >= currentDate ? null : { invalidDate: true };
    };
  }

  futureDateValidator(effectiveDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const endDate = new Date(control.value);
      return endDate > effectiveDate ? null : { invalidEndDate: true };
    };
  }

  abc(endDate: Date): ValidatorFn {
    // alert(endDate);
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);
      console.log(selectedDate, endDate, 'dates are here');
      // alert('wqe');
      return selectedDate > endDate ? { invalidDateRange: true } : null;
    };
  }

  // dateRangeValidator(effectiveDateControl: Date, endDateControl: Date): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const effectiveDate = new Date(effectiveDateControl.value);
  //     const endDate = new Date(endDateControl.value);
  //     if (endDateControl.value && effectiveDate > endDate) {
  //       return { invalidDateRange: true };
  //     }
  //     return null;
  //   };
  // }

  // endDateValidator(effectiveDate: Date): ValidatorFn {
  //   console.log(effectiveDate, "date");
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const endDate = new Date(control.value);
  //     return endDate <= effectiveDate ? null : { invalidEndDate: true };
  //   };
  // }
}
