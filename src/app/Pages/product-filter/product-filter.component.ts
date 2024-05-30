import { Component, ViewChild } from '@angular/core';
import { GroupProductsComponent } from '../group-products/group-products.component';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css'],
})
export class ProductFilterComponent {
  @ViewChild(GroupProductsComponent)
  groupProductsComponentInstance!: GroupProductsComponent;
  companyName: string = '';
  groupName: string= '';
  selectedCompanyName: string = '';
  constructor() {}

  CompanyName(companyName: string, groupName: string): void {
    // Update the companyName property
    this.companyName = companyName;
    this.groupName = groupName;

    // Pass the companyName to the GroupProductsComponent
    this.groupProductsComponentInstance.companyName = companyName;
    this.groupProductsComponentInstance.groupName = groupName;
  }
}
