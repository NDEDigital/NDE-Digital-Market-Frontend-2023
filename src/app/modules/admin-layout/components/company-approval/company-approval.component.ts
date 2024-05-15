import { Component, ElementRef, ViewChild } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { EmailService } from 'src/app/services/email.service';
import { TableHeadersService } from 'src/app/services/table-headers.service';

@Component({
  selector: 'app-company-approval',
  templateUrl: './company-approval.component.html',
  styleUrls: ['./company-approval.component.css'],
})
export class CompanyApprovalComponent {
  headers!: string[];
  btnIndex = -1;
  companies: any;
  imagePath = '';
  isHovered: any | null = null;

  imageTitle = 'No Data Found!';
  selectedCompanyCodeValues: { [key: string]: any } = {};
  @ViewChild('msgModalBTN') msgModalBTN!: ElementRef;
  alertTitle: string = '';
  alertMsg: string = '';
  isApproved: boolean = false;
  isRejected: boolean = false;

  constructor(
    private companyService: CompanyService,
    private emailService: EmailService,
    private tableHeadersService: TableHeadersService
  ) {}

  ngOnInit() {
    this.getData(this.btnIndex);
    this.headers = this.tableHeadersService.companyApprovalTableHeaders;
  }
  onSelectedCompanyCodeChange(event: any) {
    console.log('Selected Company Code Value:', event);
    this.selectedCompanyCodeValues[event.companyCode] = event.event;
    // You can perform any action with the received value here
  }
  getData(status: any) {
    console.log(status);
    this.btnIndex = status;
    this.companyService.GetCompaniesBasedOnStatus(this.btnIndex).subscribe({
      next: (response: any) => {
        this.companies = response;
        // console.log(this.companies, 'companies....');
        maxUser: this.companies.maxUser;
      },
      error: (error: any) => {
        //console.log(error);
      },
    });
  }

  showImage(event: any) {
    console.log(event);
    this.imagePath = '/asset' + event.tradeLicense.split('asset')[1];
    this.imageTitle = event.status;
  }

  updateCompany(event: any) {
    console.log(event);
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
    const userCnt =
      this.selectedCompanyCodeValues[event.companyCode] || event.maxUser;
    if (userCnt < 0) {
      // Handle the invalid input (e.g., display an error message)
      this.alertTitle = 'Error!';
      this.alertMsg = 'Please enter a non-negative value for the user count.';
      this.msgModalBTN.nativeElement.click();
      return; // Prevent further processing
    }
    const cmp = {
      companyCode: event.companyCode,
      isActive: event.status,
      maxUser: userCnt,
    };
    console.log('kire', this.selectedCompanyCodeValues[event.companyCode]);
    console.log('kire', event.maxUser);
    console.log('kire', userCnt);
    console.log(cmp);
    this.companyService.UpdateCompany(cmp).subscribe({
      next: (response: any) => {
        //console.log(response);
        this.getData(this.btnIndex);
        this.sendEmailToCompany(
          event.email,
          event.companyCode,
          userCnt,
          event.status
        );
        this.selectedCompanyCodeValues[event.companyCode] = null;
        if (event.status) {
          this.isApproved = true;
          this.isRejected = false;
          this.alertTitle = 'Success!';
          this.alertMsg = 'Company is approved sucessfully.';
        } else {
          this.isApproved = false;
          this.isRejected = true;
          this.alertTitle = 'Rejected!';
          this.alertMsg = 'Company is Rejected.';
        }
        this.msgModalBTN.nativeElement.click();
      },
      error: (error: any) => {
        //console.log(error);
      },
    });
  }

  sendEmailToCompany(email: any, companyId: any, maxUser: any, Isactive: any) {
    // You can customize the email message to include companyId, max users, and admin info
    let message = '';
    if (Isactive === 1) {
      message = `Thank you for registering your company! Your Company ID is ${companyId}.
   You can add up to ${maxUser} users as sellers, and the first added user will be the Company Admin.`;
    } else if (Isactive === 0) {
      message = `Your request for registering your company is rejected!`;
    } else {
      message = `We updated your max USer Limit!`;
    }
    this.emailService
      .sendEmail(email, 'Company Registration Successful', message)
      .subscribe({
        next: (response: any) => {
          //console.log(response);
          // Handle success
        },
        error: (error: any) => {
          //console.log(error);
          // Handle error
        },
      });
  }
}
