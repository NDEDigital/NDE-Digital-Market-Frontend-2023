import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SellerOrderOverviewService } from 'src/app/services/seller-order-overview.service';
import { OrderApiService } from 'src/app/services/order-api.service';
import { ProductReturnServiceService } from 'src/app/services/product-return-service.service';
import { ReviewRatingsService } from 'src/app/services/review-ratings.service';
interface ProductType {
  orderNo: any;
  productId: any;
  specification: any;
  stockQty: any;
  saleQty: any;
  unitId: any;
  netPrice: any;
  address: any;
  productGroupID: any;
  addedBy: string;
  addedPC: string;
}
@Component({
  selector: 'app-seller-orders',
  templateUrl: './seller-orders.component.html',
  styleUrls: ['./seller-orders.component.css'],
})
export class SellerOrdersComponent {
  @ViewChild('closeModalButton') closeModalButton!: ElementRef;
  @ViewChild('productStatusModalBTN') productStatusModalBTN!: ElementRef;
  @ViewChild('closeBTN') closeBTN!: ElementRef;
  orderSection: boolean = true;
  activeNav: string = '';
  alertMsg = '';
  pageNum = 1;
  rowCount = 10;
  toShipCount = 0;
  toDeliverCount = 0;
  toReviewCount = 0;
  ToReturnCount = 0;
  ReturnedCount = 0;
  allCount = 0;
  sellerOrder: any = [];
  loading: boolean = true;
  data: any = [];
  returnTypeData: any = [];
  selectedRating: number = 0;
  item: any;
  reviewForm: FormGroup;
  returnForm: FormGroup;
  returnData: any = [];
  isFormValid = false;
  rating = 0;
  formData = new FormData();
  imageFileName: string | undefined;
  errorMsg = false;
  detailData: any;
  productImageSrc: string = '';
  returnType = false;
  forError: any;
  orderDetailDescription: any = {
    Approved: 'Order is waiting for Seller Approval',
    Processing: 'Processing product',
    Pending: 'Order is waiting for Admin Approval',
    'Ready to Ship': ' Product is  ready to ship',
    Shipped: 'Product is on the way to deliver',
    Delivered: 'Delivered product',
    Cancelled: 'Cancelled product',
  };
  // Array of possible order statuses
  statusArray = [
    'Approved',
    'Processing',
    'ReadyToShip',
    'ToDeliver',
    'Delivered',
    'Reviewed',
    'ToReturn',
    'Returned',
    'Rejected',
  ];

  btnIndex = -2;

  constructor(
    private router: Router,
    private orderService: OrderApiService,
    private reviewService: ReviewRatingsService,
    private returnService: ProductReturnServiceService,
    private sellerService: SellerOrderOverviewService
  ) {
    // Initialize review form with validators
    this.reviewForm = new FormGroup({
      rating: new FormControl(Validators.required),
      image: new FormControl(),
      reviwField: new FormControl(),
    });

    // Subscribe to form value changes to update form validation status
    this.reviewForm.valueChanges.subscribe(() => {
      this.isFormValid = this.reviewForm.valid;
    });

    // Initialize return form
    this.returnForm = new FormGroup({
      orderNo: new FormControl(''),
      groupName: new FormControl(''),
      goodsName: new FormControl(''),
      groupCode: new FormControl(''),
      goodsId: new FormControl(0),
      remarks: new FormControl(''),
      typeId: new FormControl(''),
      price: new FormControl(''),
      detailsId: new FormControl(''),
      sellerCode: new FormControl(''),
      deliveryDate: new FormControl(''),
    });
  }

  /**
   * Lifecycle hook that runs after the component's view has been initialized.
   * Loads initial data and sets up form control listeners.
   */
  ngOnInit() {
    this.loadData();

    this.reviewForm.get('rating')?.valueChanges.subscribe((rating) => {
      this.errorMsg = false;
      this.rating = rating;
    });
  }

  /**
   * Sets the detail data for the selected order.
   * @param detail - The order detail data to set.
   */
  setDetail(detail: any) {
    this.detailData = detail;
  }

  /**
   * Navigates to the product detail page and stores the selected item in session storage.
   * @param detail - The detail of the product to view.
   */
  goToDetail(detail: any) {
    this.item = detail;

    let obj = {
      approveSalesQty: this.item.quantity,
      companyName: this.item.companyName,
      dimensionUnit: this.item.dimensionUnit,
      finish: this.item.finish,
      goodsId: this.item.goodsId,
      goodsName: this.item.goodsName,
      grade: this.item.grade,
      groupCode: this.item.groupCode,
      groupName: this.item.groupName,
      imagePath: this.item.imagePath,
      length: this.item.length,
      price: this.item.price,
      quantityUnit: this.item.quantityUnit,
      salesQty: this.item.quantity,
      sellerCode: this.item.supplierCode,
      specification: this.item.ProductDescription,
      stockQty: this.item.quantity,
      weight: this.item.width,
    };

    sessionStorage.setItem('productData', JSON.stringify(obj));
    window.open('/productDetails', '_blank');
  }

  /**
   * Loads the order data for the current seller.
   */
  loadData() {
    const companyCode = localStorage.getItem('CompanyCode');

    this.orderService.getOrdersForSeller(companyCode, '').subscribe({
      next: (response: any) => {
        console.log(response, 'newsellerorder');
        this.sellerOrder = response;
        this.loading = false;
        this.forError = true;
      },
      error: (error: any) => {
        this.forError = false;
        console.log(error);
      },
    });
  }

  /**
   * Retrieves order data based on the specified status.
   * @param status - The status of the orders to retrieve.
   */
  getData(status: string) {
    const companyCode = localStorage.getItem('CompanyCode');

    this.orderService.getOrdersForSeller(companyCode, status).subscribe({
      next: (response: any) => {
        this.sellerOrder = response;
        this.loading = false;
        this.forError = true;
      },
      error: (error: any) => {
        this.forError = false;
      },
    });
  }

  /**
   * Handles pagination data and reloads the order data based on the selected page and row count.
   * @param data - The pagination data containing selected page index and row count.
   */
  handlePaginationData(data: {
    selectedPageIndex: number;
    selectedValue: number;
  }) {
    this.pageNum = data.selectedPageIndex;
    this.rowCount = data.selectedValue;
    this.loadData();
  }

  /**
   * Returns the description for the specified order status.
   * @param status - The status of the order.
   * @returns The description of the order status.
   */
  getStatusDescription(status: string): string {
    const description = this.orderDetailDescription[status];
    return description || '';
  }

  /**
   * Updates the status of an order and displays an alert message.
   * @param status - The new status to set for the order.
   * @param alertMessage - The alert message to display.
   * @param order - The order to update.
   */
  updateOrderStatus(status: string, alertMessage: string, order: any) {
    let uid = localStorage.getItem('code');
    // let uid: any;
    // if (uidS) uid = parseInt(uidS, 10);

    const sellerSalesMasterModel = {
      userId: uid,
      totalPrice: order.totalPrice,
      bUserId: order.buyerUserId,
      addedBy: 'user',
      addedPC: '0.0.0.0',
      sellerSalesDetailsList: [] as ProductType[],
    };

    let detailIDs = '';

    order.orderDetailsListForSeller.forEach((product: any, index: number) => {
      detailIDs += product.orderDetailId;

      if (index < order.orderDetailsListForSeller.length - 1) {
        detailIDs += ',';
      }

      const salesDetail: ProductType = {
        orderNo: order.orderNo,
        productId: product.productId,
        specification: product.specification,
        stockQty: product.stockQty,
        saleQty: product.saleQty,
        unitId: product.unitId,
        netPrice: product.netPrice,
        address: order.buyerAddress,
        productGroupID: product.productGroupID,
        addedBy: 'user',
        addedPC: '0.0.0.0',
      };

      sellerSalesMasterModel.sellerSalesDetailsList.push(salesDetail);
    });

    this.sellerService
      .UpdateSellerOrderDetailsStatus(detailIDs, status, sellerSalesMasterModel)
      .subscribe({
        next: (response: any) => {
          this.alertMsg = alertMessage;
          this.productStatusModalBTN.nativeElement.click();
          if (status == 'ReadyToShip') this.btnIndex = 4;
          if (status == 'ToDeliver') this.btnIndex = 5;
          if (status == 'Delivered') this.btnIndex = 6;
          if (status == 'Reviewed') this.btnIndex = 7;
          if (status == 'ToReturn') this.btnIndex = 8;
          if (status == 'Returned') this.btnIndex = 9;
          if (status == 'Rejected') this.btnIndex = 2;
          if (status == 'Processing') this.btnIndex = 3;
          this.getData(status);
        },
        error: (error: any) => {
          console.log(error);
          this.alertMsg = `You don't have enough Quantity!`;
          this.productStatusModalBTN.nativeElement.click();
        },
      });
  }

  /**
   * Updates the status of an order based on the current button index.
   * @param stat - The current status of the order.
   * @param order - The order to update.
   */
  updateOrder(stat: any, order: any) {
    let status = '';
    let alertMessage = '';

    switch (this.btnIndex) {
      case -1:
        status = stat === 'Rejected' ? 'Rejected' : 'Processing';
        alertMessage = `Order status is ${status}!`;
        break;
      case 3:
        status = 'ReadyToShip';
        alertMessage = `Order status is ${status}!`;
        break;
      case 4:
        status = 'ToDeliver';
        alertMessage = `Order status is ${status}!`;
        break;
      case 5:
        status = 'Delivered';
        alertMessage = `Order status is ${status}!`;
        break;
      case 8:
        status = 'Returned';
        alertMessage = `Order status is ${status}!`;
        break;
      default:
        console.log('Invalid button index');
    }
    console.log(status, order);
    if (status) {
      this.updateOrderStatus(status, alertMessage, order);
    }
  }

  /**
   * Navigates to the invoice page for the specified order.
   * @param orderId - The ID of the order to view the invoice for.
   */
  gotoInvoice(orderId: any) {
    sessionStorage.setItem('orderMasterID', orderId);
    window.open('/sellerInvoice', '_blank');
  }
}
