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

  @ViewChild('editBannerModalCenterG') EditBannerModalCenterG!: ElementRef;
  @ViewChild('prdouctExistModalBTN') PrdouctExistModalBTN!: ElementRef;
  addBannerForm!: FormGroup;
  isError: boolean = false;
  alertMsg: string = '';
  imagePathPreview: string = '';
  isEditMode: boolean = false;
  banners: any[] = [];
  bannerImage: string = '';
  currentBanner: any = null;
  addingBanner: boolean = false;

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

  openAddGroupModal(): void {
    this.resetForm();
    this.isEditMode = false;
    this.currentBanner = null;

    this.AddGroupModalCenterG.nativeElement.click();
    this.EditBannerModalCenterG.nativeElement.click();
    this.fetchBanners();
  }

  fetchBanners(): void {
    let companyCode = localStorage.getItem('CompanyCode');
    if (companyCode) {
      this.bannerService.getaAllBanner(companyCode).subscribe(
        (data) => {
          this.banners = data;
          console.log('Banners updated:', this.banners);
        },
        (error) => {
          console.error('Error fetching banners:', error);
        }
      );
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.addBannerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  resetForm() {
    this.addBannerForm.reset(); // Reset the form
    this.isEditMode = false;
    this.currentBanner = null;
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
                  console.log(
                    'Banners updated after creating a new one:',
                    this.banners
                  );
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
            // this.resetForm(); // No need to reset the form again here
          },
        });
      }

      if (this.isEditMode) {
        let updateByUser = localStorage.getItem('CompanyCode');
        console.log(updateByUser, 'CompanyCode...');

        formData.append('BannerID', this.currentBanner);
        if (updateByUser !== null) {
          formData.append('UpdatedBy', updateByUser);
        } else {
          console.error('Update by code not found in localStorage');
        }
        formData.append('UpdatedPC', '0.0.0.0');

        this.bannerService.updateBanner(formData).subscribe({
          next: (response: any) => {
            // Handle successful response here
            console.log('Update successful:', response);
            this.alertMsg = 'Banner updated successfully';
            this.isEditMode = false;
            // Reset the form only for editing mode
            this.addBannerForm.reset();
              this.PrdouctExistModalBTN.nativeElement.click();
              this.fetchBanners(); 
          },
          error: (error: any) => {
            // Handle error response here
            console.error('Error updating Banner:', error);
            this.alertMsg = error.error.message || 'Error updating Banner';
            this.isError = true;
            this.isEditMode = false;
              this.PrdouctExistModalBTN.nativeElement.click();
          },
        });
        console.log(this.isEditMode, 'updating on submit');
      }
    }
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

  openEditForm(banner: any): void {
    // Reset any add banner form related states
    this.resetForm();

    // Set isEditMode to true to indicate that we are in edit mode
    this.isEditMode = true;

    // Set the currentBanner to the selected banner's ID
    this.currentBanner = banner.bannerID;
 this.displayImage(banner.imagepath);
    // Set the form values based on the selected banner
    this.addBannerForm.patchValue({
      bannerDescription: banner.bannerDescription,
      bannerImage: banner.bannerImage, // Assuming this is the image URL
    });

    // Open the edit banner modal without jQuery
    const modalElement = document.getElementById('editBannerModalCenter');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
    }
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

  editBanner(): void {
    if (this.isEditMode) {
      let updateByUser = localStorage.getItem('CompanyCode');
      console.log(updateByUser, 'CompanyCode...');
      if (!this.isEditMode || !this.currentBanner) {
        return; // If not in edit mode or no current banner selected, do nothing
      }

      if (this.addBannerForm.valid) {
        const formData = new FormData();

        // Append form data, similar to onSubmit method

        formData.append('BannerID', this.currentBanner);
        // Other formData appends...

        if (updateByUser !== null) {
          formData.append('UpdatedBy', updateByUser);
        } else {
          console.error('Update by code not found in localStorage');
        }
        formData.append('UpdatedPC', '0.0.0.0');

        this.bannerService.updateBanner(formData).subscribe({
          next: (response: any) => {
            console.log('Update successful:', response);
            this.alertMsg = 'Banner updated successfully';
            this.isEditMode = false;
            this.addBannerForm.reset();
            this.fetchBanners(); // Refresh banner list
          },
          error: (error: any) => {
            console.error('Error updating Banner:', error);
            this.alertMsg = error.error.message || 'Error updating Banner';
            this.isError = true;
            this.isEditMode = false;
          },
        });
      } else {
        console.log('Form is not valid');
      }
    }
  }
}


