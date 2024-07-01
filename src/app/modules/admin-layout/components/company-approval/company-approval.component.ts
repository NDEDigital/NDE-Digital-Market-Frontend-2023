import { Component, ElementRef, ViewChild, DestroyRef } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { EmailService } from 'src/app/services/email.service';
import { TableHeadersService } from 'src/app/services/table-headers.service';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

  isError: boolean = false;
  loading = false;
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
    private tableHeadersService: TableHeadersService,
    private destroyRef: DestroyRef
  ) {}

  // Lifecycle hook that runs once the component has been initialized
  ngOnInit() {
    this.getData(this.btnIndex); // Fetch initial data based on the default button index
    this.headers = this.tableHeadersService.companyApprovalTableHeaders; // Initialize table headers
  }

  // Event handler for changes in the selected company code
  onSelectedCompanyCodeChange(event: any) {
    console.log('Selected Company Code Value:', event);
    this.selectedCompanyCodeValues[event.companyCode] = event.event; // Store the selected company code value
  }

  // Fetch companies data based on the status
  getData(status: any) {
    console.log(status);
    this.btnIndex = status; // Update the button index
    this.handleApiCall(
      this.companyService.GetCompaniesBasedOnStatus(this.btnIndex),
      (response: any) => {
        this.companies = response; // Update companies data
      },
      'Failed to load companies'
    );
  }

  // Display the image related to the company's trade license
  showImage(event: any) {
    console.log(event);
    this.imagePath = '/asset' + event.tradeLicense.split('asset')[1]; // Extract the image path
    this.imageTitle = event.status; // Set the image title based on status
  }

  // Update company details based on the event
  updateCompany(event: any) {
    console.log(event);
    const userCnt = this.getUserCount(event); // Get the user count

    if (this.isUserCountInvalid(userCnt)) {
      this.showAlert(
        'Error!',
        'Please enter a non-negative value for the user count.'
      );
      return; // Exit if the user count is invalid
    }

    const cmp = this.createCompanyObject(event, userCnt); // Create the company object for the update
    this.handleApiCall(
      this.companyService.UpdateCompany(cmp),
      (response: any) => {
        this.handleUpdateCompanySuccess(event, userCnt); // Handle successful update
      },
      'Failed to update company'
    );
  }

  // Helper function to get the user count from the selected company code values or event
  getUserCount(event: any): number {
    return this.selectedCompanyCodeValues[event.companyCode] || event.maxUser;
  }

  // Helper function to validate the user count
  isUserCountInvalid(userCnt: number): boolean {
    return userCnt < 0;
  }

  // Helper function to create the company object for the update request
  createCompanyObject(event: any, userCnt: number) {
    return {
      companyCode: event.companyCode,
      isActive: event.status,
      maxUser: userCnt,
    };
  }

  // Handle the successful update of a company
  handleUpdateCompanySuccess(event: any, userCnt: number) {
    this.getData(this.btnIndex); // Refresh the data
    this.sendEmailToCompany(
      event.email,
      event.companyCode,
      userCnt,
      event.status
    );
    this.selectedCompanyCodeValues[event.companyCode] = null; // Reset the selected company code value

    if (event.status) {
      this.showAlert('Success!', 'Company is approved successfully.');
      this.isApproved = true;
      this.isRejected = false;
    } else {
      this.showAlert('Rejected!', 'Company is Rejected.');
      this.isApproved = false;
      this.isRejected = true;
    }
  }

  // Display an alert with the specified title and message
  showAlert(title: string, message: string) {
    this.alertTitle = title;
    this.alertMsg = message;
    this.msgModalBTN.nativeElement.click(); // Trigger the modal to display the alert
  }

  // Send an email to the company with the specified details
  sendEmailToCompany(email: any, companyId: any, maxUser: any, Isactive: any) {
    let message = '';
    if (Isactive === 1) {
      message = `Thank you for registering your company! Your Company ID is ${companyId}.
   You can add up to ${maxUser} users as sellers, and the first added user will be the Company Admin.`;
    } else if (Isactive === 0) {
      message = `Your request for registering your company is rejected!`;
    } else {
      message = `We updated your max User Limit!`;
    }

    this.handleApiCall(
      this.emailService.sendEmail(
        email,
        'Company Registration Successful',
        message
      ),
      (response: any) => {
        console.log(response); // Log the response for debugging
      },
      'Failed to send email'
    );
  }

  // Helper function to handle API calls with loading state and error handling
  private handleApiCall<T>(
    observable: Observable<T>,
    successCallback: (data: T) => void,
    errorMsg: string
  ): void {
    this.loading = true; // Set loading state to true
    observable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data: T) => {
        this.loading = false; // Reset loading state
        successCallback(data); // Invoke the success callback with the response data
      },
      error: (error: any) => {
        this.loading = false; // Reset loading state
        // this.handleError(error, errorMsg); 
      },
    });
  }

  // Handle errors from API calls and display an error message
  handleError(error: any, errorMsg: string): void {
    this.alertMsg = error.error.message || errorMsg; // Set the alert message
    this.isError = true;
    this.msgModalBTN.nativeElement.click(); // Trigger the modal to display the alert
  }
}
