import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TableHeadersService {
  companyApprovalTableHeaders: string[] = [
    'Index',
    'Company Code',
    'Company Name',
    'Email',
    'Business Registration Number',
    'Tax ID Number',
    'Foundation Date',
    'Trade License File',
    'Company Image',
    'Preferred Method',
    'Max User',
    'Action',
  ];
  productGroupsTableHeaders: string[] = [
    'Index',
    'Image',
    'Product Group Code',
    'Product Group Name',
    'Product Group Prefix',
    'Product Group Details',
    'Date Added',
  ];

  constructor() {}
}
