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
      console.log(selectedDate, "date selected");

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
    alert("dfjf")
    return (control: AbstractControl): ValidationErrors | null => {
      const currentDate = new Date(control.value);

      console.log(currentDate, endDate, "nottttt");

      return endDate < currentDate ? null : { invalidEndDate: true };
    };
  }




  // endDateValidator(effectiveDate: Date): ValidatorFn {
  //   console.log(effectiveDate, "date");
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const endDate = new Date(control.value);
  //     return endDate <= effectiveDate ? null : { invalidEndDate: true };
  //   };
  // }

}
