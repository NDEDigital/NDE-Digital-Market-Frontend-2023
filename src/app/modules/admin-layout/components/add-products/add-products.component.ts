import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddProductService } from 'src/app/services/add-product.service';
import { TableHeadersService } from 'src/app/services/table-headers.service';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css'],
})
export class AddProductsComponent implements OnInit, OnDestroy {
  @ViewChild('ProductImageInput') ProductImageInput!: ElementRef;
  @ViewChild('prdouctExistModalBTN') PrdouctExistModalBTN!: ElementRef;
  @ViewChild('addProductModalCenterG') AddProductModalCenterG!: ElementRef;
  @ViewChild('allselected', { static: false })
  allSelectedCheckbox!: ElementRef<HTMLInputElement>;
  addProductForm!: FormGroup;
  headers!: string[];
  productGroups: any[] = [];
  units: any[] = [];
  brands: any[] = [];
  alertMsg: string = '';
  alertTitle: string = '';
  isError: boolean = false;
  showProductDiv: boolean = false;
  productList: any;
  btnIndex = -1;
  isHovered: any | null = null;
  btnClick = false;
  addbtnClickP = false;
  isEditMode = false;
  activeProductId: number | null = null;
  currentProduct: any = null;
  existingImagePath: string = '';
  imagePathPreview: string = '';
  doubleClickData!: any;
  addBtnIndex = 1;

  selectedProducts1: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private productService: AddProductService,
    private tableHeadersService: TableHeadersService
  ) {}

  ngOnInit() {
    this.headers = this.tableHeadersService.productTableHeaders;
    this.getProductGroups();
    this.getBrands();
    this.getUnits();
    this.getProducts(-1);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getProductGroups(): void {
    this.productService
      .getProductGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          this.productGroups = data;
        },
        (error) => {
          console.error('Error fetching product groups:', error);
        }
      );
  }

  getBrands(): void {
    this.productService
      .getActiveBrands()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          this.brands = data;
          console.log('Brands List:', this.brands);
        },
        (error) => {
          console.error('Error fetching brands:', error);
        }
      );
  }

  getUnits(): void {
    this.productService
      .getUnitGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          this.units = data;
        },
        (error) => {
          console.error('Error fetching units:', error);
        }
      );
  }

  handleApiResponse(response: any, successMsg: string, status: number): void {
    setTimeout(() => {
      this.alertMsg = response.message || successMsg;
      this.isError = false;
      this.PrdouctExistModalBTN.nativeElement.click();
      this.addProductForm.reset();
    }, 50);

    this.getProducts(status);
  }

  handleError(error: any, errorMsg: string): void {
    this.alertMsg = error.error.message || errorMsg;
    this.isError = true;
    this.PrdouctExistModalBTN.nativeElement.click();
  }

  onSubmit(formData: any): void {
    this.isEditMode
      ? this.updateProduct(formData)
      : this.createProduct(formData);
  }

  createProduct(formData: any): void {
    this.productService
      .createProductList(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) =>
          this.handleApiResponse(
            response,
            'Product created successfully',
            this.btnIndex
          ),
        error: (error: any) =>
          this.handleError(error, 'Error creating product'),
      });
  }

  updateProduct(formData: any): void {
    formData.append('ProductId', this.currentProduct.productId);
    formData.append('UpdatedBy', localStorage.getItem('code') || 'Unknown');
    formData.append('UpdatedPC', '0.0.0.0');

    this.productService
      .updateProductList(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) =>
          this.handleApiResponse(
            response,
            'Product updated successfully',
            this.btnIndex
          ),
        error: (error: any) =>
          this.handleError(error, 'Error updating product'),
      });
  }

  getProducts(status: any): void {
    this.btnIndex = status;
    this.selectAll = false;
    this.productService
      .GetProductListByStatus(status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.productList = response;
          this.selectedProducts1 = [];
        },
        error: (error: any) =>
          this.handleError(error, 'Error fetching products'),
      });
  }

  openAddProductModal(): void {
    console.log('ashce');
    this.isEditMode = false;
    this.currentProduct = null;
    this.btnClick = true;
    this.openModalWithData(null);
  }

  resetForm(): void {
    this.isEditMode = false;
    this.addbtnClickP = false;
  }

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

  updateIsActive(event: any): void {
    const { isActive, productGroupId } = event;
    this.productService
      .updateProductStatus([productGroupId], isActive)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.handleProductStatusUpdate(response, isActive);
        },
        error: (error: any) =>
          this.handleError(error, 'Error updating product status'),
      });
  }

  selectedProductIds: any[] = [];

  selectAll = false;
  toggleAllCheckboxes(): void {
    this.productList.forEach(
      (product: { isSelected: boolean; productId: any }) => {
        product.isSelected = this.selectAll;
        this.updateSelectedProducts(product.productId, this.selectAll);
      }
    );
  }

  chageActiveInactive(isActive: any): void {
    if (this.selectedProducts1.length > 0) {
      this.productService
        .updateProductStatus(this.selectedProducts1, isActive)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) =>
            this.handleProductStatusUpdate(response, isActive),
          error: (error: any) =>
            this.handleError(error, 'Error updating products status'),
        });
    } else {
      this.showAlert('No Product is selected', 'No Selection!');
    }
  }

  checkboxSelected(event: { productId: any; event: any }): void {
    const isSelected: boolean = event.event.target.checked;
    this.updateSelectedProducts(event.productId, isSelected);
    this.allSelectedCheckbox.nativeElement.checked = false;
  }

  private updateSelectedProducts(productId: any, isSelected: boolean): void {
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

  showAlert(message: string, title: string): void {
    this.alertMsg = message;
    this.alertTitle = title;
    this.PrdouctExistModalBTN.nativeElement.click();
  }

  handleProductStatusUpdate(response: any, isActive: number): void {
    this.getProducts(isActive);
    this.btnIndex = isActive;
    this.showAlert(
      isActive ? 'Product is Activated!' : 'Product is Deactivated!',
      isActive ? 'Activated!' : 'Deactivated!'
    );
    this.selectAll = false;
    this.selectedProducts1 = [];
  }
}
