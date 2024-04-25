import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AddBannerService } from 'src/app/services/add-banner.service';

@Component({
  selector: 'app-banner-approval',
  templateUrl: './banner-approval.component.html',
  styleUrls: ['./banner-approval.component.css'],
})
export class BannerApprovalComponent {
  btnIndex = -1;
  // companies: any;
  imagePath = '';
  isHovered: any | null = null;
  banners: any[] = [];

  imageTitle = 'No Data Found!';
  selectedCompanyCodeValues: { [key: string]: any } = {};
  @ViewChild('msgModalBTN') msgModalBTN!: ElementRef;
  @ViewChild('msgModal') msgModal!: ElementRef;
  alertTitle: string = '';
  alertMsg: string = '';
  isApproved: boolean = false;
  isRejected: boolean = false;

  constructor(
    private http: HttpClient,
    private bannerService: AddBannerService
  ) {}

  ngOnInit() {
    this.getData();
  }
  // ngAfterViewInit() {
  //   // Ensure msgModalBTN is defined before using it
  //   if (this.msgModalBTN) {
  //     this.msgModalBTN.nativeElement.click();
  //   }
  // }
  formatDateTime(date: any) {
    if (!date) {
      return null;
    }

    // Convert to a valid date object if not already one
    let validDate = new Date(date);

    // Ensure the date is valid
    if (isNaN(validDate.getTime())) {
      return null; // Return null if invalid
    }

    // Format to 'YYYY-MM-DDTHH:MM'
    let year = validDate.getFullYear();
    let month = ('0' + (validDate.getMonth() + 1)).slice(-2); // Ensures 2 digits
    let day = ('0' + validDate.getDate()).slice(-2); // Ensures 2 digits
    let hours = ('0' + validDate.getHours()).slice(-2);
    let minutes = ('0' + validDate.getMinutes()).slice(-2);

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  getData() {
    console.log(this.btnIndex);
    this.bannerService.getBannerDataByAdmin(this.btnIndex).subscribe({
      next: (response: any) => {
        this.banners = response;
        console.log(this.banners, 'banners....');
      },
      error: (error: any) => {
        //console.log(error);
      },
    });
  }

  showImage(path: any, title: any) {
    console.log(path);

    this.imagePath = '/asset' + path.split('asset')[1];
    this.imageTitle = title;
  }
  updateBannerStatus(cmp: any, alert: any) {
    this.bannerService.UpdateBannerStatus(cmp).subscribe({
      next: () => {
        this.alertTitle = alert.alertTitle;
        this.alertMsg = alert.alertMsg;
        this.isApproved = alert.isApproved;
        this.isRejected = alert.isRejected;
        this.btnIndex = alert.btnIndex;

        if (this.msgModalBTN) {
          this.msgModalBTN.nativeElement.click();
        }
        this.getData();
      },
      error: (error) => {
        console.log(error);
        this.alertTitle = 'Error';
        this.alertMsg = 'Something went wrong.';
        this.isApproved = false;
        this.isRejected = true;
        if (this.msgModalBTN) {
          this.msgModalBTN.nativeElement.click();
        }
      },
    });
  }
  // updateBannerStatus(cmp: any, alert: any) {
  //   this.bannerService.UpdateBannerStatus(cmp).subscribe({
  //     next: () => {
  //       this.alertTitle = alert.alertTitle;
  //       this.alertMsg = alert.alertMsg;
  //       if (this.msgModalBTN) {
  //         this.msgModalBTN.nativeElement.click(); // Trigger the modal
  //       }
  //     },
  //     error: () => {
  //       this.alertTitle = 'Error';
  //       this.alertMsg = 'Something went wrong.';
  //       if (this.msgModalBTN) {
  //         this.msgModalBTN.nativeElement.click(); // Trigger the modal
  //       }
  //     },
  //   });
  // }
  updateCompany(
    BannerID: any,
    StartDate: any,
    EndDate: any,
    IsActive: any,
    IsBannerStatus: any
  ) {
    const cmp = {
      bannerID: BannerID,
      isActive: IsActive,
      updatedDate: Date.now,
      updatedBy: 'admin',
      updatedPC: '0.0.0.0',
      startDate: StartDate,
      endDate: EndDate,
      isBannerStatus: IsBannerStatus,
    };
    const alert = {
      alertTitle: 'Success!',
      alertMsg: 'Banner updated successfully.',
      isApproved: true,
      isRejected: false,
      btnIndex: 1,
    };
    if (StartDate && EndDate && IsActive) {
      this.updateBannerStatus(cmp, alert);
    } else if (!IsActive && this.btnIndex == -1) {
      alert.btnIndex = 0;
      alert.isRejected = true;
      alert.isApproved = false;
      this.alertMsg = 'Banner Rejected Successfully';
      this.updateBannerStatus(cmp, alert);
    } else if (this.btnIndex == 1 && !IsActive) {
      alert.btnIndex = 0;
      alert.isRejected = true;
      alert.isApproved = false;
      this.alertMsg = 'Banner Rejected Successfully';
      this.updateBannerStatus(cmp, alert);
    } else if (this.btnIndex == 0 && StartDate && EndDate) {
      this.updateBannerStatus(cmp, alert);
    } else {
      this.isApproved = false;
      this.isRejected = true;
      this.alertTitle = 'Reminder';
      this.alertMsg = 'Please provide StartDate and EndDate.';
      if (this.msgModalBTN) {
        this.msgModalBTN.nativeElement.click();
      }
    }
  }
}
