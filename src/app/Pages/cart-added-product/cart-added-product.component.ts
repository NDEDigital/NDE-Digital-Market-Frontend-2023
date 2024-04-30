import { Component, ElementRef, ViewChild } from '@angular/core';
import { CartDataService } from 'src/app/services/cart-data.service';
import { CartItem } from './cart-item.interface';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OrderApiService } from 'src/app/services/order-api.service';

@Component({
  selector: 'app-cart-added-product',
  templateUrl: './cart-added-product.component.html',
  styleUrls: ['./cart-added-product.component.css'],
})
export class CartAddedProductComponent {
  @ViewChild('loginModalBTN') LoginModalBTN!: ElementRef;
  @ViewChild('closeLoginModal') CloseLoginModal!: ElementRef;

  cartDataDetail: Map<string, CartItem> = new Map<string, CartItem>();
  cartDataQt = new Map<string, number>();
  saveLaterData: Map<string, CartItem> = new Map<string, CartItem>();
  saveLaterDataQt = new Map<string, number>();
  cartCount: number = 0;
  totalPrice: number = 0;
  showUpBtn: any;
  buyerValue: any;
  cardTotalAmount = 0;
  cardData: any;

  cartLength: number = 0;
  constructor(
    private cartDataService: CartDataService,
    private route: Router,
    private http: HttpClient,
    private orderApiService: OrderApiService
  ) {}

  ngOnInit(): void {
    // this.cartDataService.clearCartData();
    this.fetchCartData();
  }

  fetchCartData(): void {
    this.getAddToCardData();
    // this.cartDataService.clearCartData();
    this.cartDataService.initializeAndLoadData();
    const cartData = this.cartDataService.getCartData();
    this.cartDataDetail = cartData.cartDataDetail;
    console.log;
    this.cartDataQt = cartData.cartDataQt;
    // console.log("cartDataQt",this.cartDataQt);
    this.cartCount = this.cartDataService.getCartCount();

    this.totalPrice = this.cartDataService.getTotalPrice();
    //console.log(this.cartCount);
  }

  getAddToCardData() {
    this.buyerValue = localStorage.getItem('code');
    this.cartDataService.getAddToCardDataByBuyer(this.buyerValue).subscribe({
      next: (response: any) => {
        console.log(response.result);
        this.cardData = response.result;
        this.cartLength = this.cardData.length;
        this.cardTotalAmount = 0;
        this.cardData.forEach((element: any) => {
          this.cardTotalAmount += parseFloat(element.totalPrice);
        });
        console.log('new card Data', response.result);

        console.log('new card Data', this.cardData.size);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  // delete data
  sentCardDetails(changeValue: any, entry: any) {
    const formData = new FormData();
    const addToCart = {
      companyCode: entry.companyCode,
      productID: entry.goodsId,
      productGroupID: entry.groupCode,
      unitID: entry.unitId,
      productCardQuantity: changeValue,
      addedDate: '',
      addedBy: 'user',
      addedPC: '0.0.0.0',
    };
    console.log(addToCart, 'ashce');
    formData.append('buyerUserID', this.buyerValue);
    formData.append('companyCode', entry.companyCode);
    formData.append('productID', entry.goodsId);
    formData.append('productGroupID', entry.groupCode);
    formData.append('unitID', entry.unitId);
    formData.append('productCardQuantity', changeValue);
    formData.append('addedDate', '');
    formData.append('addedBy', 'user');
    formData.append('addedPC', '0.0.0.0');
    formData.append('updatedDate', '');
    formData.append('updatedBy', 'user');
    formData.append('updatedPC', '0.0.0.0');

    this.cartDataService.createAddCardDataByByer(formData).subscribe({
      next: (response: any) => {
        console.log(response);
        this.getAddToCardData();
      },
      error: (error: any) => {
        console.log(error);
      },
    });
    if (changeValue === '') {
      changeValue = 1;
    }
    // this.cartDataService.setPrice(entry.netPrice, Number(changeValue), key);

    // this.cartDataService.setCartData(entry, parseFloat(changeValue));
    this.fetchCartData();
    this.showUpBtn = '';
  }

  deleteCartProduct(entry: any) {
    this.cartDataService.deleteCartData(entry);
    this.cartCount--;
    this.fetchCartData();
  }

  // deleteCartProduct(entry: any) {
  //   //console.log(entry);

  //   this.cartDataDetail.delete(entry.groupCode + '&' + entry.goodsID);
  //   let qt: number | undefined = this.cartDataQt.get(
  //     entry.groupCode + '&' + entry.goodsID
  //   );
  //   if (qt != undefined) {
  //     let price: string = entry.price;
  //     this.totalPrice -= qt * parseFloat(price);
  //     this.cartDataService.setCartCount(entry.groupCode + '&' + entry.goodsID);
  //     this.cartDataService.setPrice(parseFloat(price), qt, 'minus');
  //     this.updateCount();
  //   }
  //   this.cartDataQt.delete(entry.groupCode + '&' + entry.goodsID);
  //   this.cartDataService.updateData(this.cartDataDetail, this.cartDataQt);
  // }
  procedBtn: any;
  procced() {
    // alert(this.showUpBtn);
    if (this.showUpBtn) {
      // alert('Update the value');
      this.procedBtn = false;
    } else {
      //console.log(localStorage.getItem('loginStatus'));
      if (localStorage.getItem('loginStatus') === null) {
        // this.route.navigate(['/login']);
        this.LoginModalBTN.nativeElement.click();
      } else {
        if (this.cartDataDetail.size > 0) {
          this.route.navigate(['/checkout']);
        } else {
          //console.log('select product');
        }
      }
    }
  }

  productPage() {
    this.route.navigate(['/']);
  }

  validateInput(event: any, qty: any) {
    if (String(event.target.value).match(/^\d+$/)) {
      let inputNumber = parseInt(event.target.value);

      if (inputNumber < 1) {
        inputNumber = 1;
      } else if (inputNumber > qty) {
        // console.log("event data", event);
        inputNumber = parseInt(event.value) || 1;
      }

      event.target.value = inputNumber;
    } else {
      event.target.value = '';
    }
  }

  // Additional commented-out code that sets the value to 1 if it's 0
  // Uncomment this section if needed
  // else if (event.target.value === 0) {
  //     event.target.value = 1;
  // }

  // save later
  // saveForLater(key: any, value: any) {
  //   this.saveLaterData.set(key, value);
  //   let qt: number | undefined = this.cartDataQt.get(key);
  //   if (qt != undefined) {
  //     this.saveLaterDataQt.set(key, qt);
  //   }

  //   this.deleteCartProduct(value);
  //   this.cartDataService.setSaveLaterData(
  //     this.saveLaterData,
  //     this.saveLaterDataQt
  //   );
  //   this.updateCount();
  // }

  // moveToCart(key: any, value: any) {

  //   let qt: number | undefined = this.saveLaterDataQt.get(key);
  //   this.cartDataDetail.set(key, value);
  //   if (qt != undefined) {
  //     this.cartDataQt.set(key, qt);
  //     this.cartDataService.setCartCount(qt, "add");
  //      let price: string = value.price;
  //      this.totalPrice += (parseFloat(price)*qt);
  //      this.cartDataService.setPrice(parseFloat(price), 'add');
  //     this.updateCount();
  //   }
  //   this.saveLaterData.delete(key);
  //   this.saveLaterDataQt.delete(key);
  // }

  // deleteSaveProduct(key: any) {
  //   this.saveLaterData.delete(key);
  //   this.saveLaterDataQt.delete(key);
  //   this.cartDataService.setSaveLaterData(
  //     this.saveLaterData,
  //     this.saveLaterDataQt
  //   );
  // }
}
