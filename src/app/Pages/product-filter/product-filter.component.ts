import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { GroupProductsComponent } from '../group-products/group-products.component';
import { OurTopSellerComponent } from '../our-top-seller/our-top-seller.component';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css'],
})
export class ProductFilterComponent implements AfterViewInit {
  @ViewChild(GroupProductsComponent)
  groupProductsComponentInstance!: GroupProductsComponent;

  @ViewChild(OurTopSellerComponent)
  topSellerComponentInstance!: OurTopSellerComponent;

  companyName: string = '';
  companyCode: string = '';
  groupName: string = '';
  selectedCompanyName: string = '';
  selectedCompanyCode : string = '';

  constructor() {}

  ngAfterViewInit(): void {
    // You can now safely access the ViewChild components here
  }

  CompanyName(companyName: string, groupName: string): void {
    // Update the companyName and groupName properties
    this.companyName = companyName;
    this.groupName = groupName;

    // Pass the companyName and groupName to the GroupProductsComponent
    if (this.groupProductsComponentInstance) {
      this.groupProductsComponentInstance.companyName = companyName;
      this.groupProductsComponentInstance.groupName = groupName;
    }
    if (this.topSellerComponentInstance) {
      this.topSellerComponentInstance.companyName = companyName;
    }
  }

  // CompanyCode(companyCode: string): void {
  //   this.companyCode = companyCode;

  //   // Pass the companyCode to the OurTopSellerComponent
  //   if (this.topSellerComponentInstance) {
  //     this.topSellerComponentInstance.companyCode = companyCode;
  //   }
  // }
}
