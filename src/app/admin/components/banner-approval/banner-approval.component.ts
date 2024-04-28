import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AddBannerService } from 'src/app/services/add-banner.service';

@Component({
  selector: 'app-banner-approval',
  templateUrl: './banner-approval.component.html',
  styleUrls: ['./banner-approval.component.css'],
})
export class BannerApprovalComponent implements OnInit {
  btnIndex = -1;
  // companies: any;
  imagePath = '';
  isHovered: any | null = null;
  banners: any[] = [];
  // isEndDateEnabled: boolean = false;
  imageTitle = 'No Data Found!';
  selectedCompanyCodeValues: { [key: string]: any } = {};
  @ViewChild('msgModalBTN') msgModalBTN!: ElementRef;
  @ViewChild('msgModal') msgModal!: ElementRef;
  alertTitle: string = '';
  alertMsg: string = '';
  isApproved: boolean = false;
  isRejected: boolean = false;
  minDateTime: string = '';
  minEndDateTime: string = '';
  // minDateTime: string = '';
  minEndDateTimes: string[] = [];
  activeEndDate: boolean[] = [];
  isEndDateEnabled: boolean[] = [];

  constructor(
    private http: HttpClient,
    private bannerService: AddBannerService
  ) {
    this.getCurrentDateTime();

    console.log(this.minDateTime);
  }

  ngOnInit() {
    this.getData();
    this.minDateTime = this.getCurrentDateTime(); // Initialize before change detection
    this.minEndDateTime = this.getCurrentDateTime();
    this.minEndDateTimes = [this.minEndDateTime];
    this.isEndDateEnabled = [false]; // Default to false
  }

  // ngAfterViewInit() {
  //   // Ensure msgModalBTN is defined before using it
  //   if (this.msgModalBTN) {
  //     this.msgModalBTN.nativeElement.click();
  //   }
  // }

  getCurrentDateTime(): string {
    const now = new Date();
    return now.toISOString().substring(0, 16);
  }

  getFormattedDate(date: string, index: number): string {
    // console.log(date);

    this.selectedCompanyCodeValues[index + 1 + '_date2'] = date;

    return this.selectedCompanyCodeValues[index + 1 + '_date2'] || null;
  }

  getFormattedDate2(date: string, index: number): string {
    // console.log(date, 'value');
    this.selectedCompanyCodeValues[index + 1 + '_date1'] = date;
    return this.selectedCompanyCodeValues[index + 1 + '_date1'] || null;
  }

  truncateDescription(description: string, maxLength: number = 16): string {
    if (description.length > maxLength) {
      return `${description.substring(0, maxLength)}...`;
    }
    return description;
  }

  getData() {
    console.log(this.btnIndex);
    this.minDateTime = '';
    this.minEndDateTime = '';
    this.minEndDateTimes = [];
    this.activeEndDate = [];
    this.isEndDateEnabled = [];
    this.minDateTime = this.getCurrentDateTime();
    this.minEndDateTime = this.getCurrentDateTime();
    this.bannerService.getBannerDataByAdmin(this.btnIndex).subscribe({
      next: (response: any) => {
        this.banners = response;

        this.selectedCompanyCodeValues = [];
        console.log(this.banners, 'banners....');
      },
      error: (error: any) => {
        //console.log(error);
      },
    });
  }

  onStartDateChange(index: number, event: any): void {
    // this.isEndDateEnabled[index] = true;
    const selectedDate = new Date(event.target.value);
    const nextDay = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000);

    const formattedDate = nextDay.toISOString().substring(0, 16);

    setTimeout(() => {
      this.minEndDateTimes[index] = formattedDate;
    }, 10);
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

        this.minDateTime = '';
        this.minEndDateTime = '';
        this.minEndDateTimes = [];
        this.activeEndDate = [];
        this.isEndDateEnabled = [];
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

  updateCompany(
    BannerID: any,
    StartDate: any,
    EndDate: any,
    IsActive: any,
    IsBannerStatus: any
  ) {
    if (StartDate >= EndDate) {
      this.isApproved = false;
      this.isRejected = true;
      this.alertTitle = 'Error';
      this.alertMsg = 'StartDate Cant be greater than EndDate';
      if (this.msgModalBTN) {
        this.msgModalBTN.nativeElement.click();
      }
      return;
    }
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
      console.log(cmp);
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
