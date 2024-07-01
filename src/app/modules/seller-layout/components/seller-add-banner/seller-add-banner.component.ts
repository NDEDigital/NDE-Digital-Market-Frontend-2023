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
  showCheckboxes: boolean = false;
  isAds: boolean = false;
  banners: any[] = [];
  bannerImage: string = '';
  currentBanner: any;
  // addingBanner: boolean = false;
  existingImagePath: string = '';
  btnIndex = -1;
  isHovered: any | null = null;
  alertTitle: any;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private bannerService: AddBannerService
  ) {}
  ngOnInit() {
    this.addBannerForm = new FormGroup({
      bannerDescription: new FormControl('', Validators.required),
      bannerImage: new FormControl('', Validators.required),
    });
    this.fetchBanners();
  }
  isApproved(banner: any): boolean {
    return banner.isBannerStatus === true && banner.isActive === true;
  }
  isExpired(banner: any): boolean {
    return banner.isBannerStatus === false && banner.isActive === false;
  }
  adsTrue(): void {
    this.isAds = true;
  }
  adsFalse(): void {
    this.isAds = false;
  }
  openAddGroupModal(): void {
    this.resetForm();
    this.isEditMode = false;
    this.currentBanner = null;
    this.showCheckboxes = true;

    this.fetchBanners();
    this.AddGroupModalCenterG.nativeElement.click();
    // this.EditBannerModalCenterG.nativeElement.click();
  }

  fetchBanners(): void {
    let companyCode = localStorage.getItem('CompanyCode');
    console.log('checking the company code', companyCode);

    if (companyCode) {
      let role = localStorage.getItem('role');
      // if (role !== 'admin') {
      // Company code is present, fetch banners with matching company code
      this.bannerService
        .getaAllBanner(encodeURIComponent(companyCode))
        .subscribe(
          (data) => {
            this.banners = data;
            console.log('Banners updated:', this.banners);
          },
          (error) => {
            // console.error('Error fetching banners:', error);
          }
        );
    } else {
      console.error('Company code is not available in local storage.');
    }

    // }
    // else {
    //   let role = 'admin';
    //   this.bannerService.getaAllBanner(role).subscribe(
    //     (data) => {
    //       this.banners = data;
    //       console.log('Banners updated:', this.banners, role);
    //     },
    //     (error) => {
    //       // console.error('Error fetching banners:', error);
    //     }
    //   );
    // }
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
        if (value === null) {
          value = '';
        }
        formData.append(key, value);
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
      // let userRole = localStorage.getItem('role'); // Assuming you have a 'Role' in localStorage
      // if (userRole === 'admin') {
      //   companyCode = 'admin';
      // }
      if (companyCode) {
        formData.append('CompanyCode', companyCode);
      }
      formData.append('IsActive', 'true');
      formData.append('IsAds', this.isAds ? 'true' : 'false');
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
            setTimeout(() => {
              this.PrdouctExistModalBTN.nativeElement.click();
            }, 50);
            this.resetForm();

            this.fetchBanners();
            this.btnIndex = -1;
            let companyCode = localStorage.getItem('CompanyCode');
            // let userRole = localStorage.getItem('role'); // Assuming you have a 'Role' in localStorage
            // if (userRole === 'admin') {
            //   companyCode = 'admin';
            // }
            if (companyCode) {
              this.bannerService.getaAllBanner(companyCode).subscribe(
                (data) => {
                  this.banners = data;
                  // console.log(
                  //   'Banners updated after creating a new one:',
                  //   this.banners
                  // );
                },
                (error) => {
                  // console.error('Error fetching banners:', error);
                }
              );
            }
          },
          error: (error: any) => {
            this.alertMsg = error.error.message;
            this.isError = true;
            this.PrdouctExistModalBTN.nativeElement.click();
            this.addBannerForm.reset();
            this.btnIndex = -1;
            // this.resetForm(); // No need to reset the form again here
          },
        });
      }
      if (this.isEditMode) {
        let updateByUser = localStorage.getItem('CompanyCode');
        // console.log(updateByUser, 'CompanyCode...');
        let userRole = localStorage.getItem('role'); // Assuming you have a 'Role' in localStorage
        if (userRole === 'admin') {
          companyCode = 'admin';
        }
        formData.append('BannerID', this.currentBanner);
        if (updateByUser !== null) {
          formData.append('UpdatedBy', updateByUser);
        } else {
          // console.error('Update by code not found in localStorage');
        }
        formData.append('UpdatedPC', '0.0.0.0');
        this.bannerService.updateBanner(formData).subscribe({
          next: (response: any) => {
            // Handle successful response here
            // console.log('Update successful:', response);
            this.alertMsg = 'Banner updated successfully';
            this.isEditMode = false;
            // Reset the form only for editing mode
            this.addBannerForm.reset();
            this.PrdouctExistModalBTN.nativeElement.click();
            this.btnIndex = -1;
            this.fetchBanners();
          },
          error: (error: any) => {
            // Handle error response here
            // console.error('Error updating Banner:', error);
            this.alertMsg = error.error.message || 'Error updating Banner';
            this.isError = true;
            this.isEditMode = false;
            this.PrdouctExistModalBTN.nativeElement.click();
          },
        });
        // console.log(this.isEditMode, 'updating on submit');
        this.isEditMode = false;
        this.updateFormValidators();
      }
    }
  }
  deleteBanner(banner: any): void {
    const bannerId = this.currentBanner;
    if (!confirm('Are you sure you want to delete this banner?')) {
      return; // If the user cancels deletion, do nothing
    }
    // alert(bannerId);
    this.bannerService.deleteBanner(bannerId).subscribe({
      next: (response: any) => {
        // console.log('Banner deleted:', response);
        // Remove the deleted banner from the banners array
        this.banners = this.banners.filter((b) => b.bannerID !== bannerId);
        // console.log('delete successfully:', response);
        this.alertMsg = 'Banner deleted successfully';
        this.isEditMode = false;
        // Reset the form only for editing mode
        this.addBannerForm.reset();
        this.PrdouctExistModalBTN.nativeElement.click();
        this.fetchBanners();
        this.isEditMode = false;
        this.updateFormValidators();
      },
      error: (error: any) => {
        // console.error('Error deleting banner:', error);
        // Optionally, show an error message or perform any other action
      },
    });
    const modalElement = document.getElementById('editBannerModalCenter');
    if (modalElement && this.isEditMode) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
    }
  }
  openEditForm(banner: any): void {
    // Reset any add banner form related states
    // Set isEditMode to true to indicate that we are in edit mode
    console.log('ashce');
    this.isEditMode = true;
    this.updateFormValidators();
    // Set the currentBanner to the selected banner's ID
    this.currentBanner = banner.bannerID;
    this.displayImage(banner.bannerImage);
    // console.log(this.imagePathPreview, 'imagepath');
    // console.log(banner.bannerImage, 'bannerImage');
    // this.existingImagePath = banner.bannerImage;
    // Set the form values based on the selected banner
    this.addBannerForm.patchValue({
      bannerDescription: banner.bannerDescription,
      bannerImage: banner.imagePathPreview,
    });

    this.isAds = banner.isAds;
    // console.log(this.addBannerForm);
    // Open the edit banner modal without jQuery
    const modalElement = document.getElementById('editBannerModalCenter');
    if (modalElement && this.isEditMode) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
    }
  }
  updateFormValidators(): void {
    // Check if the control exists
    const productGroupImageControl = this.addBannerForm.get('bannerImage');
    if (productGroupImageControl) {
      if (this.isEditMode) {
        productGroupImageControl.clearValidators();
      } else {
        productGroupImageControl.setValidators(Validators.required);
      }
      productGroupImageControl.updateValueAndValidity();
    }
  }
  closeEditFormWithoutUpdate(): void {
    // Reset any form-related states
    this.resetForm();
    this.showCheckboxes = false;
    // Set isEditMode to false to indicate that we are not in edit mode anymore
    this.isEditMode = false;
    this.updateFormValidators();
  }
  displayImage(imagePath: string): void {
    console.log('Received imagePath:', imagePath);
    if (imagePath) {
      const imageUrl = '/asset' + imagePath.split('asset')[1];
      // console.log('Constructed imageUrl:', imageUrl);
      this.imagePathPreview = imageUrl;
    } else {
      this.imagePathPreview = 'not upload yet';
    }
    this.AddGroupModalCenterG.nativeElement.click();
  }
}
