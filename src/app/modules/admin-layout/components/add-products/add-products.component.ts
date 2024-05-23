import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntilDestroyed } from 'src/app/services/destroy.service';
import { AddProductService } from 'src/app/services/add-product.service';
import { TableHeadersService } from 'src/app/services/table-headers.service';
import { DestroyService } from 'src/app/services/destroy.service';
interface Product {
  productId: number;
  productGroupID: number;
  isSelected?: boolean;
  [key: string]: any; // Add more specific fields as required
}

interface ApiResponse {
  message: string;
}
@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css'],
  providers: [DestroyService],
})
export class AddProductsComponent implements OnInit {
  // ViewChild for accessing DOM elements
  @ViewChild('ProductImageInput') ProductImageInput!: ElementRef;
  @ViewChild('prdouctExistModalBTN') PrdouctExistModalBTN!: ElementRef;
  @ViewChild('addProductModalCenterG') AddProductModalCenterG!: ElementRef;
  @ViewChild('allselected', { static: false })
  allSelectedCheckbox!: ElementRef<HTMLInputElement>;

  // Table headers and various dropdown data
  headers!: string[];
  productGroups: any[] = [];
  units: any[] = [];
  brands: any[] = [];

  // Alert message variables
  alertMsg: string = '';
  alertTitle: string = '';
  isError: boolean = false;

  // Product list and related state variables
  showProductDiv: boolean = false;
  productList: Product[] = [];
  btnIndex: number = -1;
  isHovered: any | null = null;
  btnClick: boolean = false;
  addbtnClickP: boolean = false;
  isEditMode: boolean = false;
  activeProductId: number | null = null;
  currentProduct: Product | null = null;
  existingImagePath: string = '';
  imagePathPreview: string = '';
  doubleClickData!: Product;
  addBtnIndex: number = 1;

  selectedProducts1: number[] = [];
  selectedProductIds: any[] = [];

  selectAll = false;
  loading = false;
  constructor(
    private productService: AddProductService,
    private tableHeadersService: TableHeadersService,
    private destroyService: DestroyService
  ) {}

  ngOnInit() {
    // Initialize headers and fetch initial data
    this.headers = this.tableHeadersService.productTableHeaders;
    this.fetchInitialData();
  }

  // Fetch initial data for product groups, brands, and units
  private fetchInitialData(): void {
    this.getProductGroups();
    this.getBrands();
    this.getUnits();
    this.getProducts(-1);
  }

  // Generic method to fetch data using a provided function
  private getData<T>(
    fetchFunction: () => Observable<T>,
    successCallback: (data: T) => void,
    errorMsg: string
  ) {
    this.handleApiCall(fetchFunction(), successCallback, errorMsg);
  }

  // Fetch product groups
  getProductGroups(): void {
    this.getData(
      () => this.productService.getProductGroups(),
      (data: any) => (this.productGroups = data),
      'Error fetching product groups'
    );
  }

  // Fetch active brands
  private getBrands(): void {
    this.getData(
      () => this.productService.getActiveBrands(),
      (data: any) => {
        this.brands = data;
        console.log('Brands List:', this.brands);
      },
      'Error fetching brands'
    );
  }

  // Fetch unit groups
  private getUnits(): void {
    this.getData(
      () => this.productService.getUnitGroups(),
      (data: any) => (this.units = data),
      'Error fetching units'
    );
  }

  // Fetch products based on status
  getProducts(status: number): void {
    this.btnIndex = status;
    this.selectAll = false;
    this.getData(
      () => this.productService.GetProductListByStatus(status),
      (response: any) => {
        this.productList = response;
        this.selectedProducts1 = [];
      },
      'Error fetching products'
    );
  }

  // Submit form data  (create or update product)
  onSubmit(formData: any): void {
    this.isEditMode
      ? this.updateProduct(formData)
      : this.createProduct(formData);
  }

  // Create a new product
  createProduct(formData: FormData): void {
    this.handleApiCall(
      this.productService.createProductList(formData),
      (response: any) =>
        this.handleApiResponse(
          response,
          'Product created successfully',
          this.btnIndex
        ),
      'Error creating product'
    );
  }

  // Update an existing product
  updateProduct(formData: FormData): void {
    if (this.currentProduct) {
      formData.append('ProductId', this.currentProduct.productId.toString());
      formData.append('UpdatedBy', localStorage.getItem('code') || 'Unknown');
      formData.append('UpdatedPC', '0.0.0.0');
      this.handleApiCall(
        this.productService.updateProductList(formData),
        (response: any) =>
          this.handleApiResponse(
            response,
            'Product updated successfully',
            this.btnIndex
          ),
        'Error updating product'
      );
    }
  }

  // Update product status (active/inactive)
  updateIsActive(event: { isActive: boolean; productGroupId: number }): void {
    const { isActive, productGroupId } = event;
    this.handleApiCall(
      this.productService.updateProductStatus([productGroupId], isActive),
      (response: any) =>
        this.handleProductStatusUpdate(response, isActive ? 1 : 0),
      'Error updating product status'
    );
  }

  // Toggle selection for all checkboxes
  toggleAllCheckboxes(): void {
    this.productList.forEach((product: Product) => {
      product.isSelected = this.selectAll;
      this.updateSelectedProducts(product.productId, this.selectAll);
    });
  }

  // Change status (active/inactive) for selected products
  chageActiveInactive(isActive: boolean): void {
    if (this.selectedProducts1.length > 0) {
      this.handleApiCall(
        this.productService.updateProductStatus(
          this.selectedProducts1,
          isActive
        ),
        (response: any) =>
          this.handleProductStatusUpdate(response, isActive ? 1 : 0),
        'Error updating products status'
      );
    } else {
      this.showAlert('No Product is selected', 'No Selection!');
    }
  }

  // Handle checkbox selection
  checkboxSelected(event: { productId: number; event: Event }): void {
    const isSelected: boolean = (event.event.target as HTMLInputElement)
      .checked;
    this.updateSelectedProducts(event.productId, isSelected);
    this.allSelectedCheckbox.nativeElement.checked = false;
  }

  openAddProductModal(): void {
    console.log('ashce');
    this.isEditMode = false;
    this.currentProduct = null;
    this.btnClick = true;
    this.openModalWithData(null);
  }

  // Reset the form
  resetForm(): void {
    this.isEditMode = false;
    this.addbtnClickP = false;
  }

  // Open modal with product data for editing
  openModalWithData(product: any): void {
    this.isEditMode = !!product;
    this.currentProduct = product;
    this.btnClick = true;
    this.addbtnClickP = !product;
    console.log(product);
    if (product) {
      this.doubleClickData = product;
      this.activeProductId = product.productGroupID;
    }
  }

  // Update selected products list based on checkbox state
  private updateSelectedProducts(productId: number, isSelected: boolean): void {
    if (isSelected) {
      this.selectedProducts1.push(productId);
    } else {
      this.selectedProducts1 = this.selectedProducts1.filter(
        (id) => id !== productId
      );
    }
    this.allSelectedCheckbox.nativeElement.checked =
      this.selectedProducts1.length === this.productList.length;
  }

  // Handle API call with success and error handling
  private handleApiCall<T>(
    observable: Observable<T>,
    successCallback: (data: T) => void,
    errorMsg: string
  ): void {
    this.loading = true;
    observable.pipe(takeUntilDestroyed(this.destroyService)).subscribe({
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

  // Show alert modal with a message and title
  showAlert(message: string, title: string): void {
    this.alertMsg = message;
    this.alertTitle = title;
    this.PrdouctExistModalBTN.nativeElement.click();
  }

  // Handle product status update and refresh product list
  handleProductStatusUpdate(response: ApiResponse, isActive: number): void {
    this.getProducts(isActive);
    this.btnIndex = isActive;
    this.showAlert(
      isActive ? 'Product is Activated!' : 'Product is Deactivated!',
      isActive ? 'Activated!' : 'Deactivated!'
    );
    this.selectAll = false;
    this.selectedProducts1 = [];
  }

  // Handle API response success
  handleApiResponse(
    response: ApiResponse,
    successMsg: string,
    status: number
  ): void {
    setTimeout(() => {
      this.alertMsg = response.message || successMsg;
      this.isError = false;
      this.PrdouctExistModalBTN.nativeElement.click();
    }, 50);

    this.getProducts(status);
  }

  // Handle API response error
  handleError(error: any, errorMsg: string): void {
    this.alertMsg = error.error.message || errorMsg;
    this.isError = true;
    this.PrdouctExistModalBTN.nativeElement.click();
  }
}
