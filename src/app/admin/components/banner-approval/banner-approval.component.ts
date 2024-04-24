import { Component, ElementRef, ViewChild } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AddBannerService } from 'src/app/services/add-banner.service';
import { CompanyService } from 'src/app/services/company.service';

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
  alertTitle: string = '';
  alertMsg: string = '';
  isApproved: boolean = false;
  isRejected: boolean = false;

  constructor(
    // private companyService: CompanyService,
    // private emailService: EmailService

    private http: HttpClient,
    private bannerService: AddBannerService,
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.bannerService.getBanner(this.btnIndex).subscribe({
      next: (response: any) => {
        this.banners = response;
        // console.log(this.banners, 'banners....');
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
    companyEmail: any,
    companyCode: any,
    Isactive: any,
    maxUser: any
  ) {
    //console.log(companyCode, Isactive, companyEmail);
    // const selectedCompany = this.companies.find(
    //   (cmp: any) => cmp.companyCode === companyCode
    // );
    // if (selectedCompany) {
    //   this.selectedCompanyCodeValue = selectedCompany.companyCode;
    //   //console.log(
    //     'Selected Company Code Value:',
    //     this.selectedCompanyCodeValue
    //   );
    // }
    // console.log(
    //   'Selected Company Code Value:',
    //   this.selectedCompanyCodeValues[companyCode]
    // );
    const userCnt = this.selectedCompanyCodeValues[companyCode] || maxUser;
    if (userCnt < 0) {
      // Handle the invalid input (e.g., display an error message)
      this.alertTitle = 'Error!';
      this.alertMsg = 'Please enter a non-negative value for the user count.';
      this.msgModalBTN.nativeElement.click();
      return; // Prevent further processing
    }

    const cmp = {
      companyCode: companyCode,
      isActive: Isactive,
      maxUser: userCnt,
    };
    this.companyService.UpdateCompany(cmp).subscribe({
      next: (response: any) => {
        //console.log(response);
        this.getData();
        // this.sendEmailToCompany(companyEmail, companyCode, userCnt, Isactive);
        this.selectedCompanyCodeValues[companyCode] = null;

        if (Isactive) {
          this.isApproved = true;
          this.isRejected = false;
          this.alertTitle = 'Success!';
          this.alertMsg = 'Banner is approved sucessfully.';
        } else {
          this.isApproved = false;
          this.isRejected = true;
          this.alertTitle = 'Rejected!';
          this.alertMsg = 'Banner is rejected.';
        }
        this.msgModalBTN.nativeElement.click();
      },
      error: (error: any) => {
        //console.log(error);
      },
    });
  }
}
