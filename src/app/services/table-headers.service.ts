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

  productTableHeaders: string[] = [
    'Index',
    'Product Group Name',
    'Product Name',
    'Product SubName',
    'Brand',
    'Unit',
    'Specification',
    'Image',
    'Date Added',
  ];
  bannerApprovalTableHeaders: string[] = [
    'Index',
    'AD Type',
    'Company Name',
    'Banner Description',
    'Banner Image',
    'Start Date',
    'End Date',
    'Action',
  ];
  brandTableHeaders: string[] = [
    'Index',
    'Brands Name',
    'Short Name',
    'Description',
  ];
  productApprovalTableHeaders: string[] = [
    'Index',
    'Image',
    'Product Name',
    'Seller Name',
    'Company',
    'Price',
    'Discount Amount',
    'Discount %',
    'Net Price',
    'Effective Date',
    'End Date',
    'Previous Price',
    'Action',
  ];
  userListTableHeaders: string[] = [
    '#',
    'Full Name',
    'Phone',
    'Email',
    'Address',
    'Added Date',
  ];
  unitListTableHeaders: string[] = ['Index', 'Unit Name', 'Unit Symbol'];
  constructor() {}
}
