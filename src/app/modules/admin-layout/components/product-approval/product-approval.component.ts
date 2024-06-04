import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  DestroyRef,
} from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddProductService } from 'src/app/services/add-product.service';
import { TableHeadersService } from 'src/app/services/table-headers.service';

// Interface for product status update
interface ProductStatusUpdate {
  userId: any;
  companyCode: any;
  productId: any;
  status: any;
}

// Interface for API response
interface ApiResponse {
  message: string;
}

// Enum for product status
enum ProductStatus {
  Approved = 'Approved',
  Pending = 'Pending',
  Rejected = 'Rejected',
}

@Component({
  selector: 'app-product-approval',
  templateUrl: './product-approval.component.html',
  styleUrls: ['./product-approval.component.css'],
})
export class ProductApprovalComponent implements OnInit {
  // ViewChild decorators to access DOM elements
  @ViewChild('allselected', { static: true })
  allSelectedCheckbox!: ElementRef<HTMLInputElement>;
  @ViewChild('msgModalBTN') msgModalBTN!: ElementRef;

  // Component properties
  btnIndex = -1;
  productsData: any;
  headers!: string[];
  imagePath = '';
  imageTitle = 'No Data Found!';
  selectedCompanyCodeValues: { [key: string]: number } = {};
  isHovered: any | null = null;
  showModal = false;
  selectedProduct: any = null;
  alertTitle: string = '';
  alertMsg: string = '';
  isApproved = false;
  isRejected = false;
  searchTerm = '';
  filteredProductsData: any;
  selectedProducts: any[] = [];
  selectedProductIds: any[] = [];
  selectedProducts1: any[] = [];
  selectAll = false;
  loading = false;

  // Constructor injecting necessary services
  constructor(
    private productService: AddProductService,
    private tableHeadersService: TableHeadersService,
    private destroyRef: DestroyRef
  ) {}

  // OnInit lifecycle hook to initialize component
  ngOnInit(): void {
    // Setting headers for the table
    this.headers = this.tableHeadersService.productApprovalTableHeaders;
    // Fetching initial data
    this.getData(this.btnIndex);
  }

  // Method to fetch product data based on status
  getData(status: any): void {
    this.btnIndex = status;
    this.allSelectedCheckbox.nativeElement.checked = false;
    status = this.resolveStatus(status);
    this.selectedProducts1.length = 0;
    this.handleApiCall(
      this.productService.getProductData(status),
      (response: any) => {
        this.productsData = response;
        this.filteredProductsData = response;
      },
      'Error fetching product data'
    );
  }

  // Method to show product details in a modal
  showDetails(product: any): void {
    this.selectedProduct = product;
    this.showModal = true;
    console.log('click', product.productId);
  }

  // Method to show product image
  showImage(path: string, title: string): void {
    this.imagePath = path.split('src')[1];
    this.imageTitle = title;
  }

  // Method to update product status
  updateProduct(event: ProductStatusUpdate): void {
    const { userId, companyCode, productId, status } = event;
    const productStatus = { userId, companyCode, productId, status };
    this.selectedProducts = [{ ...productStatus }];
    this.handleApiCall(
      this.productService.updateProduct(this.selectedProducts),
      (response: any) => {
        this.handleApiResponse(
          response,
          'Product status updated successfully',
          status
        );
        this.msgModalBTN.nativeElement.click();
        this.handleStatusChange(status);
      },
      'Error updating product'
    );
  }

  // Method to change the status of selected products
  changeStatus(status: any): void {
    if (this.selectedProducts1.length > 0) {
      this.selectedProducts1.forEach((product) => {
        product.status = status;
      });
      this.handleApiCall(
        this.productService.updateProduct(this.selectedProducts1),
        (response: any) => {
          this.handleApiResponse(
            response,
            'Product statuses updated successfully',
            status
          );
          this.msgModalBTN.nativeElement.click();
          this.handleStatusChange(status);
        },
        'Error updating product statuses'
      );
    } else {
      this.showNoSelectionAlert();
    }
  }

  // Method to toggle all checkboxes for product selection
  toggleAllCheckboxes(): void {
    this.selectedProducts1.length = 0;
    this.productsData.forEach((product: any) => {
      product.isSelected = this.selectAll;
      if (this.selectAll) {
        this.selectedProducts1.push({
          userId: product.userId,
          companyCode: product.companyCode,
          productId: product.productId,
        });
      }
    });
  }

  // Method to handle individual product selection via checkboxes

  checkboxSelected(event: {
    userId: any;
    companyCode: any;
    productId: any;
    event: Event;
  }): void {
    const { userId, companyCode, productId, event: nativeEvent } = event;
    const isSelected: boolean = (nativeEvent.target as HTMLInputElement)
      .checked;
    if (isSelected) {
      this.selectedProducts1.push({ userId, companyCode, productId });
    } else {
      this.selectedProducts1 = this.selectedProducts1.filter(
        (product) =>
          product.productId !== productId ||
          product.userId !== userId ||
          product.companyCode !== companyCode
      );
    }
    this.allSelectedCheckbox.nativeElement.checked =
      this.selectedProducts1.length === this.productsData.length;
  }

  // Method to filter products based on search criteria
  filterProducts(data: any): void {
    this.filteredProductsData = data.status
      ? this.productsData.filter((product: any) =>
          product.companyName.toLowerCase().includes(data.status.toLowerCase())
        )
      : this.productsData;
  }

  // Helper method to resolve status from enum or status code
  private resolveStatus(status: any): string {
    const APPROVED_STATUS = 1;
    const PENDING_STATUS = -1;
    if (status == APPROVED_STATUS || status == ProductStatus.Approved) {
      return ProductStatus.Approved;
    } else if (status == PENDING_STATUS || status == ProductStatus.Pending) {
      return ProductStatus.Pending;
    } else {
      return ProductStatus.Rejected;
    }
  }
  // Method to handle status change logic
  private handleStatusChange(status: string): void {
    if (status == 'Approved') {
      this.btnIndex = 1;
      this.isApproved = true;
      this.isRejected = false;
      this.alertTitle = 'Success!';
      this.alertMsg = 'Product is approved successfully.';
    } else if (status == 'Rejected') {
      this.btnIndex = 0;
      this.isApproved = false;
      this.isRejected = true;
      this.alertTitle = 'Rejected!';
      this.alertMsg = 'Product is rejected.';
    }
  }
  // Method to show alert when no product is selected
  private showNoSelectionAlert(): void {
    this.alertTitle = 'No Selection!';
    this.alertMsg = 'No Product is selected';
    this.msgModalBTN.nativeElement.click();
  }

  // Handle API response success
  private handleApiResponse(
    response: ApiResponse,
    successMsg: string,
    status: number
  ): void {
    setTimeout(() => {
      this.alertMsg = response.message || successMsg;
      this.isApproved = false;
      this.msgModalBTN.nativeElement.click();
    }, 50);

    this.getData(status);
  }

  // Handle API response error
  private handleError(error: any, errorMsg: string): void {
    this.alertMsg = error.error.message || errorMsg;
    this.isRejected = true;
    this.msgModalBTN.nativeElement.click();
  }

  // Handle API call with success and error handling
  private handleApiCall<T>(
    observable: Observable<T>,
    successCallback: (data: T) => void,
    errorMsg: string
  ): void {
    this.loading = true;
    observable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data: T) => {
        this.loading = false;
        successCallback(data);
      },
      error: (error: any) => {
        this.loading = false;
        this.handleError(error, errorMsg);
      },
    });
  }
}
