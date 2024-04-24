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
  getData() {
    console.log(this.btnIndex);
    this.bannerService.getBanner(this.btnIndex).subscribe({
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
    if (StartDate && EndDate) {
      this.bannerService.UpdateBannerStatus(cmp).subscribe({
        next: () => {
          this.alertTitle = 'Success!';
          this.alertMsg = 'Banner updated successfully.';
          this.isApproved = true;
          this.isRejected = false;
          this.btnIndex = 1;
          if (this.msgModalBTN) {
            this.msgModalBTN.nativeElement.click(); // Open modal
          }
        },
        error: () => {
          this.alertTitle = 'Error';
          this.alertMsg = 'Something went wrong.';
          this.isApproved = false;
          this.isRejected = true;
        },
      });
    } else {
      this.isApproved = false;
      this.isRejected = true;
      this.alertTitle = 'Reminder';
      this.alertMsg = 'Please provide StartDate and EndDate.';
      if (this.msgModalBTN) {
        this.msgModalBTN.nativeElement.click(); // Open modal
      }
    }
  }
}
