import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AddBannerService } from 'src/app/services/add-banner.service';
import { TableHeadersService } from 'src/app/services/table-headers.service';

@Component({
  selector: 'app-banner-approval',
  templateUrl: './banner-approval.component.html',
  styleUrls: ['./banner-approval.component.css'],
  providers: [DatePipe],
})
export class BannerApprovalComponent implements OnInit {
  headers!: string[];
  btnIndex = -1;
  btnFilter = 0;
  bannerFilter: any;
  imagePath = '';
  isHovered: any | null = null;
  banners: any[] = [];
  imageTitle = 'No Data Found!';
  selectedCompanyCodeValues: { [key: string]: any } = {};

  // References to modal elements
  @ViewChild('msgModalBTN') msgModalBTN!: ElementRef;
  @ViewChild('msgModal') msgModal!: ElementRef;

  // Alert properties
  alertTitle: string = '';
  alertMsg: string = '';
  isApproved: boolean = false;
  isRejected: boolean = false;

  // Date-related properties
  minDateTime: string = '';
  minEndDateTime: string = '';
  minEndDateTimes: string[] = [];
  activeEndDate: boolean[] = [];
  isEndDateEnabled: boolean[] = [];
  code: string = '';

  constructor(
    private http: HttpClient,
    private bannerService: AddBannerService,
    private datePipe: DatePipe,
    private tableHeadersService: TableHeadersService
  ) {
    this.getCurrentDateTime();
  }

  ngOnInit() {
    this.getData(this.btnIndex);
    this.minDateTime = this.getCurrentDateTime();
    this.minEndDateTime = this.getCurrentDateTime();
    this.minEndDateTimes = [this.minEndDateTime];
    this.isEndDateEnabled = [false];
    this.headers = this.tableHeadersService.bannerApprovalTableHeaders;
  }

  // Get current date in 'yyyy-MM-dd' format
  getCurrentDateTime(): string {
    const now = new Date();
    const formattedDate = this.datePipe.transform(now, 'yyyy-MM-dd');
    return formattedDate || '';
  }

  // Format date and store it in selectedCompanyCodeValues
  getFormattedDate(date: string, index: number): string {
    this.selectedCompanyCodeValues[index + 1 + '_date2'] =
      this.datePipe.transform(date, 'yyyy-MM-dd');
    return this.selectedCompanyCodeValues[index + 1 + '_date2'] || null;
  }

  getFormattedDate2(date: string, index: number): string {
    this.selectedCompanyCodeValues[index + 1 + '_date1'] =
      this.datePipe.transform(date, 'yyyy-MM-dd');
    return this.selectedCompanyCodeValues[index + 1 + '_date1'] || null;
  }

  // Truncate banner description to a specified length
  truncateDescription(bannerDescription: any): any {
    const maxLength = 16;
    if (bannerDescription.length > maxLength) {
      return `${bannerDescription.substring(0, maxLength)}...`;
    }
    return bannerDescription;
  }

  // Fetch banner data based on status
  getData(status: any) {
    this.btnIndex = status;
    this.resetDateProperties();
    this.minDateTime = this.getCurrentDateTime();
    this.minEndDateTime = this.getCurrentDateTime();

    this.bannerService.getBannerDataByAdmin(this.btnIndex).subscribe({
      next: (response: any) => {
        this.banners = response;
        this.selectedCompanyCodeValues = [];
        this.bannerFilter = 0;
        this.getFilterData(0);
      },
      error: (error: any) => {
        // Handle error
      },
    });
  }

  // Reset date-related properties
  resetDateProperties() {
    this.minDateTime = '';
    this.minEndDateTime = '';
    this.minEndDateTimes = [];
    this.activeEndDate = [];
    this.isEndDateEnabled = [];
  }

  // Filter banners based on status
  getFilterData(status: any) {
    const filteredAds = this.banners.filter(
      (banner: any) => banner.isAds === true
    );
    const filteredBanners = this.banners.filter(
      (banner: any) => banner.isAds === false
    );
    this.bannerFilter = status == 0 ? filteredAds : filteredBanners;
  }

  // Handle start date change and enable end date accordingly
  onStartDateChange(index: number, event: any): void {
    const selectedDate = new Date(event.target.value);
    const nextDay = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000);
    const formattedDate = nextDay.toISOString().substring(0, 16);
    setTimeout(() => {
      this.minEndDateTimes[index] = formattedDate;
    }, 10);
  }

  // Show image in modal
  showImage(event: any, title: any) {
    this.imagePath = '/asset' + event.split('asset')[1];
    this.imageTitle = title;
  }

  // Handle change in selected company code
  onSelectedCompanyCodeChange(event: any) {
    this.selectedCompanyCodeValues[event.companyCode] = event.event;
  }

  // Update banner status
  updateBannerStatus(cmp: any, alert: any) {
    this.bannerService.UpdateBannerStatus(cmp).subscribe({
      next: () => {
        this.showAlert(alert);
        this.getData(this.btnIndex);
      },
      error: (error) => {
        this.showAlert({
          alertTitle: 'Error',
          alertMsg: 'Something went wrong.',
          isApproved: false,
          isRejected: true,
        });
      },
    });
  }

  // Show alert modal with given properties
  showAlert(alert: any) {
    this.alertTitle = alert.alertTitle;
    this.alertMsg = alert.alertMsg;
    this.isApproved = alert.isApproved;
    this.isRejected = alert.isRejected;
    this.btnIndex = alert.btnIndex;
    if (this.msgModalBTN) {
      this.msgModalBTN.nativeElement.click();
    }
  }

  // Validate and update company details
  updateCompany(
    BannerID: any,
    StartDate: any,
    EndDate: any,
    IsActive: any,
    IsBannerStatus: any
  ) {
    function formatDate(date: any) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    const today = new Date();
    const formattedToday = formatDate(today);
    console.log("Today's Date:", formattedToday > StartDate);

    const cmp = this.createCompanyUpdateObject(
      BannerID,
      StartDate,
      EndDate,
      IsActive,
      IsBannerStatus
    );
    const alert = this.createAlertObject(
      'Success!',
      'Banner updated successfully.',
      true,
      false,
      1
    );
    if (!IsActive && this.btnIndex === -1 && (!StartDate || !EndDate)) {
      this.handleRejection(cmp);
    } else if (formattedToday > StartDate && IsActive) {
      this.showAlert({
        alertTitle: 'Reminder',
        alertMsg: 'StartDate must be greater than  Today',
        isApproved: false,
        isRejected: true,
        btnIndex: this.btnIndex,
      });
    } else if (StartDate > EndDate && IsActive) {
      this.showAlert({
        alertTitle: 'Reminder',
        alertMsg: 'StartDate must be greater than EndDate',
        isApproved: false,
        isRejected: true,
        btnIndex: this.btnIndex,
      });
    } else if (StartDate && EndDate && IsActive) {
      this.updateBannerStatus(cmp, alert);
    } else if (!IsActive && this.btnIndex === -1) {
      this.handleRejection(cmp);
    } else if (this.btnIndex === 1 && !IsActive) {
      this.handleRejection(cmp);
    } else if (this.btnIndex === 0 && StartDate && EndDate) {
      this.updateBannerStatus(cmp, alert);
    } else {
      this.showAlert({
        alertTitle: 'Reminder',
        alertMsg: 'Please provide StartDate and EndDate.',
        isApproved: false,
        isRejected: true,
      });
    }
  }

  // Create company update object
  createCompanyUpdateObject(
    BannerID: any,
    StartDate: any,
    EndDate: any,
    IsActive: any,
    IsBannerStatus: any
  ) {
    return {
      bannerID: BannerID,
      isActive: IsActive,
      updatedDate: Date.now,
      updatedBy: 'admin',
      updatedPC: '0.0.0.0',
      startDate: this.datePipe.transform(StartDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(EndDate, 'yyyy-MM-dd'),
      isBannerStatus: IsBannerStatus,
    };
  }

  // Create alert object
  createAlertObject(
    title: string,
    msg: string,
    approved: boolean,
    rejected: boolean,
    btnIndex: number
  ) {
    return {
      alertTitle: title,
      alertMsg: msg,
      isApproved: approved,
      isRejected: rejected,
      btnIndex: btnIndex,
    };
  }

  // Handle rejection scenario
  handleRejection(cmp: any) {
    const alert = this.createAlertObject(
      'Rejected!',
      'Banner Rejected Successfully',
      false,
      true,
      0
    );
    this.updateBannerStatus(cmp, alert);
  }
}
