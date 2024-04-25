import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AddBannerService } from 'src/app/services/add-banner.service';

@Component({
  selector: 'app-seller-add-banner',
  templateUrl: './seller-add-banner.component.html',
  styleUrls: ['./seller-add-banner.component.css'],
})
export class SellerAddBannerComponent {
  @ViewChild('ProductImageInput') ProductImageInput!: ElementRef;
  @ViewChild('addGroupModalCenterG') AddGroupModalCenterG!: ElementRef;
  @ViewChild('prdouctExistModalBTN') PrdouctExistModalBTN!: ElementRef;
  addBannerForm!: FormGroup;
  isError: boolean = false;
  alertMsg: string = '';
  imagePathPreview: string = '';
  isEditMode: boolean = false;
  banners: any[] = [];
  bannerImage: string = '';

  btnIndex = -1;

  isHovered: any | null = null;
  alertTitle: any;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private bannerService: AddBannerService
  ) {}

  ngOnInit() {
    this.addBannerForm = this.formBuilder.group({
      bannerDescription: ['', Validators.required],
      bannerImage: ['', Validators.required],
    });

    let companyCode = localStorage.getItem('CompanyCode');
   if (companyCode) {
     this.bannerService.getaAllBanner(companyCode).subscribe(
       (data) => {
         // Handle successful response here
          this.banners = data;
         console.log(data);
       },
       (error) => {
         // Handle error here
         console.error('Error fetching banners:', error);
       }
     );
   }
  }

  // fetchBanners(CompanyCode: any) {
  //   this.http
  //     .get<any[]>(
  //       `https://localhost:7006/api/AddBanner/GetAddBannerForSeller/${CompanyCode}`
  //     )
  //     .subscribe(
  //       (result) => {
  //         this.banners = result;
  //       },
  //       (error) => {
  //         console.error('Error fetching banners:', error);
  //         // Handle the error appropriately, e.g., show an error message to the user
  //       }
  //     );
  // }

  // fetchBanners(CompanyCode:any) {
  //   this.http
  //     .get<any[]>(
  //       `https://localhost:7006/api/AddBanner/GetAddBannerForSeller?ComapnayCode=${CompanyCode}`
  //     )
  //     .subscribe((result) => {
  //       this.banners = result;
  //     });
  //   }
  openAddGroupModal(): void {
    this.resetForm();
    this.isEditMode = false;
    this.AddGroupModalCenterG.nativeElement.click();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.addBannerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  resetForm() {
    this.addBannerForm.reset(); // Reset the form
    this.isEditMode = false;
    this.banners = [];
  }

  onSubmit(): void {
    Object.values(this.addBannerForm.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
    });

    if (this.addBannerForm.valid) {
      const formData = new FormData();

      Object.keys(this.addBannerForm.value).forEach((key) => {
        let value = this.addBannerForm.value[key];
        if (value === null && (key === 'startDate' || key === 'endDate')) {
          value = '';
        }

        formData.append(key, value);
        console.log(key, value);
      });

      formData.append(
        'BannerImageFile',
        this.ProductImageInput.nativeElement.files[0]
      );

      let userID = localStorage.getItem('code');
      if (userID) {
        formData.append('UserId', userID);
      }

      let companyCode = localStorage.getItem('CompanyCode');
      if (companyCode) {
        formData.append('CompanyCode', companyCode);
      }
      formData.append('IsActive', 'true');
      formData.append('AddedBy', 'user');
      formData.append('AddedPC', '0.0.0.0');

      formData.append('UpdatedBy', 'user');
      formData.append('UpdatedPC', '0.0.0.0');
      formData.append('IsPayment', 'false');
      formData.append('PaymentRemarks', 'null');

      if (!this.isEditMode) {
        this.bannerService.createBanner(formData).subscribe({
          next: (response: any) => {
            this.alertMsg = response.message;
            this.isError = false;
            this.PrdouctExistModalBTN.nativeElement.click();
            this.resetForm();

 let companyCode = localStorage.getItem('CompanyCode');
        if (companyCode) {
          this.bannerService.getaAllBanner(companyCode).subscribe(
            (data) => {
              this.banners = data;
              console.log('Banners updated after creating a new one:', this.banners);
            },
            (error) => {
              console.error('Error fetching banners:', error);
            }
          );
        }
      },
      error: (error: any) => {
        this.alertMsg = error.error.message;
        this.isError = true;
        this.PrdouctExistModalBTN.nativeElement.click();
        this.addBannerForm.reset();
        this.resetForm();
      },
    });
  }

      if (this.isEditMode) {
        let updateByUser = localStorage.getItem('code');
        if (updateByUser !== null) {
          formData.append('UpdatedBy', updateByUser);
        } else {
          console.error('Update by code not found in localStorage');
        }
        formData.append('UpdatedPC', '0.0.0.0');
      }
    } else {
      // Form is not valid
    }
  }

  editBanner(banner: any): void {
    // Set isEditMode to true to indicate that we are in edit mode
    this.isEditMode = true;

    // Assuming you have a method to get banner ID from banner object
    const bannerId = banner.bannerID;

    // Optionally, you can prepare formData here
    const formData = new FormData();

    // Call the editBanner method of the service
    this.bannerService.editBanner(bannerId, formData).subscribe({
      next: (response: any) => {
        this.alertMsg = response.message;
        this.isEditMode = false;
        // this.fetchBanners();
        // Optionally, close any modal or show a success message
      },
      error: (error: any) => {
        console.error('Error updating banner:', error);
        // Optionally, show an error message to the user
      },
    });
  }

  deleteBanner(banner: any): void {
    if (!confirm('Are you sure you want to delete this banner?')) {
      return; // If the user cancels deletion, do nothing
    }

    const bannerId = banner.bannerID;
    console.log(bannerId);

    this.bannerService.deleteBanner(bannerId).subscribe({
      next: (response: any) => {
        console.log('Banner deleted:', response);
        // Remove the deleted banner from the banners array
        this.banners = this.banners.filter((b) => b.bannerID !== bannerId);
      },
      error: (error: any) => {
        console.error('Error deleting banner:', error);
        // Optionally, show an error message or perform any other action
      },
    });
  }
}
