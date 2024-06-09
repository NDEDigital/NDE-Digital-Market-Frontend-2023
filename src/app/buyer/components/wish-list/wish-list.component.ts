import { Component, ElementRef, ViewChild } from '@angular/core';
import { QueryList, ViewChildren } from '@angular/core';
import { CartDataService } from 'src/app/services/cart-data.service';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { OrderApiService } from 'src/app/services/order-api.service';
import { ProductReturnServiceService } from 'src/app/services/product-return-service.service';
import { ReviewRatingsService } from 'src/app/services/review-ratings.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { CartItem } from './cart-item.interface';
import { GoodsDataService } from 'src/app/services/goods-data.service';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css'],
})
export class WishListComponent {
  @ViewChild('closeModalButton') closeModalButton!: ElementRef;
  @ViewChild('imageInput') imageInput!: ElementRef;
  @ViewChild('reviewBTN') reviewBTN!: ElementRef;
  @ViewChild('closeBTN') closeBTN!: ElementRef;
  @ViewChild('CloseReviewFormModal') CloseReviewFormModalBTN!: ElementRef;
  @ViewChildren('star') stars!: QueryList<ElementRef>;
  @ViewChild('starContainer') starContainer!: ElementRef;
  @ViewChild('ProductImageInput') ProductImageInput!: ElementRef;
  orderSection: boolean = true;
  activeNav: string = '';
  pageNum = 1;
  rowCount = 10;
  toShipCount = 0;
  toDeliverCount = 0;
  toReviewCount = 0;
  ToReturnCount = 0;
  ReturnedCount = 0;
  allCount = 0;
  buyerOrder: any = [];
  wishList: any = [];
  cartDataDetail: Map<string, CartItem> = new Map<string, CartItem>();
  cartDataQt = new Map<string, number>();
  popUpCount: number = 0;
  CartButtonText = 'Add to Cart';
  cartCount: number = 0;
  totalPrice: number = 0;
  loading: boolean = true;
  data: any = [];
  returnTypeData: any = [];
  selectedRating: number = 0;
  item: any;

  returnForm: FormGroup;
  returnData: any = [];
  isFormValid = false;
  rating = 0;
  formData = new FormData();
  imageFileName: string | undefined;
  errorMsg = false;
  detailData: any;
  detailsData: any = [];
  productImageSrc: string = '';
  returnType = false;
  reviewForm!: FormGroup;
  ratingValue: number = 0;
  // stars: HTMLElement[] = [];
  currentOrderDetailId: number = 0;
  buyerId: number = 0;
  buyerValue: any;
  cartTotalAmount = 0;

  cartData: any[] = [];

  cartLength: number = 0;
  orderDetailDescription: any = {
    Approved: 'Order is waiting for Seller Approval',
    Processing: 'Processing product',
    Pending: 'Order is waiting for Admin Approval',
    'Ready to Ship': ' Product is  ready to ship',
    Shipped: 'Product is on the way to deliver',
    Delivered: 'Delivered product',
    Cancelled: 'Cancelled product',
  };
  btnIndex = -2;
  constructor(
    private router: Router,
    private orderService: OrderApiService,
    private reviewService: ReviewRatingsService,
    private returnService: ProductReturnServiceService,
    private WishlistService: WishlistService,
    private cartDataService: CartDataService
  ) {
    this.reviewForm = new FormGroup({
      rating: new FormControl(Validators.required),
      image: new FormControl(),
      reviwField: new FormControl(),
    });
    this.reviewForm.valueChanges.subscribe(() => {
      this.isFormValid = this.reviewForm.valid;
      // //console.log(this.isFormValid);
    });

    this.returnForm = new FormGroup({
      orderNo: new FormControl(''),
      groupName: new FormControl(''),
      goodsName: new FormControl(''),
      groupCode: new FormControl(''),
      productId: new FormControl(0),
      remarks: new FormControl(''),
      typeId: new FormControl('0'),
      price: new FormControl(''),
      detailsId: new FormControl(''),
      sellerCode: new FormControl(''),
      deliveryDate: new FormControl(''),
    });
  }

  ngAfterViewInit() {
    // Optional: You might need to handle changes if stars are dynamic
    this.stars.changes.subscribe((stars: QueryList<ElementRef>) => {
      // Logic to handle changes in the star elements
    });
  }

  ngOnInit() {
    this.loadData();
    // this.cartDataService.initializeAndLoadData();
    this.setServiceData();
    this.getAddTocartData();
  }
  getAddTocartData() {
    this.buyerValue = localStorage.getItem('code');
    this.cartDataService.getAddToCartDataByBuyer(this.buyerValue).subscribe({
      next: (response: any) => {
        console.log(response.result);
        this.cartData = response.result;
        this.cartLength = this.cartData.length;
        this.cartTotalAmount = 0;
        this.cartData.forEach((element: any) => {
          this.cartTotalAmount += parseFloat(element.totalPrice);
        });
        console.log('new cart Data', response.result);

        // console.log('new cart Data', this.cartData.length);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  setServiceData() {
    // this.cartCount = this.cartDataService.getCartCount();
    // this.cartDataDetail = this.cartDataService.getCartData().cartDataDetail;
    // this.cartDataQt = this.cartDataService.getCartData().cartDataQt;
    // this.totalPrice = this.cartDataService.getTotalPrice();
    console.log(
      'cartCount is:',
      this.cartCount,
      'cartataDetails:',
      this.cartDataDetail,
      'cartDataQt',
      this.cartDataQt,
      'totalPrice',
      this.totalPrice
    );
  }

  setCart(entry: any, inputQt: string) {
    //console.log(entry.approveSalesQty, 'approveSalesQty');

    if (entry.price === '' || entry.price === undefined) {
      entry.price = '0';
    }
    const formData = new FormData();
    const addToCart = {
      companyCode: entry.companyCode,
      productID: entry.goodsId,
      productGroupID: entry.groupCode,
      unitID: entry.unitId,
      productCartQuantity: inputQt,
      addedDate: '',
      addedBy: 'user',
      addedPC: '0.0.0.0',
    };

    formData.append('buyerUserID', this.buyerValue);
    formData.append('companyCode', entry.companyCode);
    formData.append('productID', entry.goodsId);
    formData.append('productGroupID', entry.groupCode);
    formData.append('unitID', entry.unitId);
    formData.append('productCartQuantity', inputQt);
    formData.append('addedDate', '');
    formData.append('addedBy', 'user');
    formData.append('addedPC', '0.0.0.0');
    formData.append('updatedDate', '');
    formData.append('updatedBy', 'user');
    formData.append('updatedPC', '0.0.0.0');

    this.cartDataService.createAddCartDataByByer(formData).subscribe({
      next: (response: any) => {
        console.log(response);
        this.getAddTocartData();
      },
      error: (error: any) => {
        console.log(error);
      },
    });
    console.log('updated cart value : ', addToCart);

    let groupCodeIdSellerId =
      entry.groupCode + '&' + entry.goodsId + '&' + entry.sellerCode;

    // this.cartDataService.setCartCount(groupCodeIdSellerId);
    // this.cartDataService.setPrice(
    //   entry.netPrice,
    //   parseInt(inputQt),
    //   groupCodeIdSellerId
    // );
    // this.cartDataService.setCartData(entry, inputQt);
    this.setServiceData();
    this.popUpCount = parseInt(inputQt);
  }

  setDetail(detail: any) {
    this.detailData = detail;
    console.log(detail, 'detail data...');

    //console.log(' details data888888888888888888888888888888 ', this.detailData);
  }
  goToDetail(detail: any) {
    console.log('details is', detail);

    window.open(
      '/productDetails?productId=' +
        btoa(detail.goodsId) +
        '&companyCode=' +
        btoa(detail.companyCode),
      '_blank'
    );
  }

  loadData() {
    console.log('hello');

    const userCode = localStorage.getItem('code');

    this.WishlistService.getWishList(userCode).subscribe({
      next: (goods: any) => {
        console.log('wishlist', goods);

        this.wishList = goods.map((good: any) => {
          // Use map instead of forEach
          return {
            companyCode: good.companyCode,
            companyName: good.companyName,
            groupCode: good.productGroupID,
            goodsId: good.productId,
            groupName: good.productGroupName,
            goodsName: good.productName,
            specification: good.specification,
            approveSalesQty: good.availableQty,
            sellerCode: good.sellerId,
            unitId: good.unitId,
            quantityUnit: good.unit,
            imagePath: good.imagePath,
            price: good.price,
            discountAmount: good.discountAmount,
            discountPct: good.discountPct,
            netPrice: good.totalPrice,
          };
        });
        this.loading = false;
        console.log('the data is', this.wishList);
      },
      error: (error: any) => {
        console.error('Error fetching wishlist:', error);
      },
    });
  }

  getData(status: string) {
    let uidS = localStorage.getItem('code');
    let userID;
    if (uidS) userID = parseInt(uidS, 10);
    this.orderService.getOrdersForBuyer(userID, status).subscribe({
      next: (response: any) => {
        console.log(response, 'get buyer order data');
        this.buyerOrder = response;
        // console.log(this.productsData,"all data");
      },
      error: (error: any) => {
        //console.log(error);
      },
    });
  }

  // btnClick(str: string) {
  //   if (str === '') {
  //     this.activeNav = str;
  //     //console.log('clicked', str);
  //   } else if (str === 'Ready to Ship') {
  //     this.activeNav = str;
  //     //console.log('clicked', str);
  //   } else if (str === 'Shipped') {
  //     this.activeNav = str;
  //     //console.log('clicked', str);
  //   } else if (str === 'Delivered') {
  //     this.activeNav = str;
  //     //console.log('clicked', str);
  //   } else if (str === 'to Return') {
  //     this.activeNav = str;
  //     //console.log('clicked', str);
  //   } else if (str === 'Returned') {
  //     this.activeNav = str;
  //     //console.log('clicked', str);
  //   }
  //   this.loadData();
  // }

  deleteFromSideCart(entry: any) {
    this.cartDataService.deleteCartDataByBuyer(entry.id).subscribe({
      next: (response: any) => {
        console.log(response);
        this.getAddTocartData();
      },
      error: (error: any) => {
        console.log(error);
      },
    });
    // this.cartDataService.deleteCartData(entry.id);
    this.setServiceData();
  }
  handleCartUpdate(): void {
    console.log('Cart needs to be updated');
    this.getAddTocartData();
  }
  // added by marufa
}
