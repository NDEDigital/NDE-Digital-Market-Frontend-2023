import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-company-approval-grid-view',
  templateUrl: './company-approval-grid-view.component.html',
  styleUrls: ['./company-approval-grid-view.component.css'],
})
export class CompanyApprovalGridViewComponent {
  @Input() cmp: any;
  @Input() isHovered: any;
  @Input() i: any;
  @Input() btnIndex: any;
  @Output() selectedCompanyCodeValuesChange = new EventEmitter<any>(); // Event emitter for passing data to parent

  @Output() showImageEvent = new EventEmitter<{
    tradeLicense: any;
    status: any;
  }>();
  @Output() updateCompanyEvent = new EventEmitter<{
    email: any;
    companyCode: any;
    status: any;
    maxUser: any;
  }>();
  constructor() {}
  showImage(tradeLicense: any, status: any) {
    console.log(tradeLicense);
    this.showImageEvent.emit({
      tradeLicense: tradeLicense,
      status: status,
    });
  }

  updateCompany(email: any, companyCode: any, status: any, maxUser: any) {
    this.updateCompanyEvent.emit({
      email: email,
      companyCode: companyCode,
      status: status,
      maxUser: maxUser,
    });
  }
  onInputChange(companyCode: any, event: any) {
    console.log(companyCode, event);
    this.selectedCompanyCodeValuesChange.emit({
      companyCode: companyCode,
      event: event,
    }); // Emit the value to parent component
  }
}
