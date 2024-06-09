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
  cartTotalAmount = 0;
  cartData!: any;
  selectAll: boolean = false;

  cartLength: number = 0;
  totalSelectedCart: number = 0;
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
    this.getAddTocartData();
    // this.cartDataService.clearCartData();
    // this.cartDataService.initializeAndLoadData();
    // const cartData = this.cartDataService.getCartData();
    // this.cartDataDetail = cartData.cartDataDetail;
    // console.log;
    // this.cartDataQt = cartData.cartDataQt;
    // // console.log("cartDataQt",this.cartDataQt);
    // this.cartCount = this.cartDataService.getCartCount();

    // this.totalPrice = this.cartDataService.getTotalPrice();
    //console.log(this.cartCount);
  }

  getAddTocartData() {
    this.buyerValue = localStorage.getItem('code');
    this.cartDataService.getAddToCartDataByBuyer(this.buyerValue).subscribe({
      next: (response: any) => {
        console.log(response.result);
        this.cartData = response.result;
        this.cartLength = this.cartData.length;
        this.cartTotalAmount = 0;
        this.totalSelectedCart = 0;
        // this.cartData.forEach((element: any) => {
        //   this.cartTotalAmount += parseFloat(element.totalPrice);
        // });
        console.log('new cart Data', response.result);

        console.log('new cart Data', this.cartData.size);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  // delete data
  sentcartDetails(changeValue: any, entry: any) {
    const formData = new FormData();
    const addToCart = {
      companyCode: entry.companyCode,
      productID: entry.goodsId,
      productGroupID: entry.groupCode,
      unitID: entry.unitId,
      productCartQuantity: changeValue,
      addedDate: '',
      addedBy: 'user',
      addedPC: '0.0.0.0',
    };
    console.log(addToCart, 'ashce');
    formData.append('buyerUserID', this.buyerValue);
    formData.append('companyCode', entry.companyCode);
    formData.append('productID', entry.productID);
    formData.append('productGroupID', entry.productGroupID);
    formData.append('unitID', entry.unitID);
    formData.append('productCartQuantity', changeValue);
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

        this.selectAll = false;
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
    console.log(entry, 'ashce');
    this.cartDataService.deleteCartDataByBuyer(entry.id).subscribe({
      next: (response: any) => {
        console.log(response);
        this.getAddTocartData();
        this.selectAll = false;
        this.cartData = this.cartData.filter(
          (cartEntry: CartEntry) => cartEntry.id !== entry.id
        );

        // Recalculate the total price and total selected count after deletion
        this.totalPrice = 0;
        this.totalSelectedCart = 0;
        this.cartData.forEach((element: CartEntry) => {
          if (element.selected) {
            this.totalPrice += parseFloat(element.totalPrice);
            this.totalSelectedCart += 1;
          }
        });

        // Update the cartTotalAmount
        this.cartTotalAmount = this.totalPrice;

        // Update the state of the selectAll checkbox based on remaining entries
        this.selectAll = this.cartData.every(
          (cartEntry: CartEntry) => cartEntry.selected
        );

        console.log('Total price of selected entries:', this.totalPrice);
        console.log('Total selected cart:', this.totalSelectedCart);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
    // this.cartDataService.deleteCartData(entry);
    // this.cartCount--;
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
  truncateProductName(productName: string, maxLength: number): string {
    // Check if the product name length exceeds maxLength
    if (productName.length > maxLength) {
      // Truncate the product name and add ellipsis
      return productName.slice(0, maxLength) + '...';
    }
    // Return the original product name if length is within limit
    return productName;
  }
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
        // Filter cartData to include only selected products
        const selectedProducts = this.cartData.filter(
          (entry: CartEntry) => entry.selected
        );
        console.log(selectedProducts);
        // If there are selected products, navigate to the checkout page
        if (selectedProducts.length > 0) {
          // Convert selectedProducts to a JSON string and then to base64
          const selectedProductsBase64 = btoa(JSON.stringify(selectedProducts));
          // Navigate to the checkout route, passing the base64 string as a URL parameter
          this.route.navigate([`/checkout/${selectedProductsBase64}`]);
        } else {
          console.log('No products selected');
        }

        // if (this.cartData.length > 0) {
        //   this.route.navigate(['/checkout']);
        // } else {
        //   //console.log('select product');
        // }
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

  // Function to handle when an entry is selected
  onEntrySelected(entry: CartEntry): void {
    console.log('Entry selected:', entry);

    this.selectAll = this.cartData.every((entry: CartEntry) => entry.selected);

    this.totalPrice = 0; // Reset total price before recalculating
    this.totalSelectedCart = 0;
    this.cartData.forEach((element: CartEntry) => {
      if (element.selected) {
        this.totalPrice += parseFloat(element.totalPrice);
        this.totalSelectedCart += 1;
      }
    });
    this.cartTotalAmount = this.totalPrice;

    console.log('Total price of selected entries:', this.totalPrice);
  }

  // Function to handle when the "Select All" checkbox changes
  onSelectAllChange(event: any): void {
    const isChecked = event.target.checked;
    this.cartData.forEach((entry: CartEntry) => {
      entry.selected = isChecked;
    });
    this.totalPrice = 0; // Reset total price before recalculating
    this.totalSelectedCart = 0;
    this.cartData.forEach((element: CartEntry) => {
      if (element.selected) {
        this.totalPrice += parseFloat(element.totalPrice);
        this.totalSelectedCart += 1;
      }
    });
    this.cartTotalAmount = this.totalPrice;
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
interface CartEntry {
  id: number;
  productName: string;
  price: number;
  companyName: string;
  availableQty: number;
  imagePath?: string;
  groupName?: string;
  selected: boolean;
  productCartQuantity: number;
  totalPrice: string;
}
