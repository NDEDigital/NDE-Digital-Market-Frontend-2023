import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CartDataService } from 'src/app/services/cart-data.service';
import { OrderApiService } from 'src/app/services/order-api.service';
interface OrderDetail {
  companyCode: string;
  productId: number;
  qty: number;
  discountPct: number;
  price: number;
  deliveryCharge: number;
  deliveryDate: string;
  specification: string;
  productGroupId: string;
  userId: number;
  unitId: number;
  discountAmount: number;
  netPrice: number;
  addedBy: string;
  addedPC: string;
}
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent {
  @ViewChild('exampleModal') modal: any; // Access the modal element
  constructor(
    private elementRef: ElementRef,
    private cartDataService: CartDataService,
    private orderApiService: OrderApiService,
    private router: Router
  ) {}

  totalItems: number = 0;
  totalAmount: number = 0;
  BkashMblNumber: any = '015*****381';
  payment_method: string = '';
  button_text: string = '';
  isCard: boolean = false;

  subTotal_text: string = '';
  buyerValue: any;
  cartTotalAmount = 0;
  cartData: any;

  cartLength: number = 0;
  userData: any;
  buyerCode: any;
  orderdata: any;
  ngOnInit() {
    this.getAddTocartData();
    // this.totalAmount = this.cartDataService.getTotalPriceWithDelivery();
    // this.totalItems = this.cartDataService.getCartData().cartDataDetail.size;
  }
  getAddTocartData() {
    this.buyerValue = localStorage.getItem('code');
    this.cartDataService.getAddToCartDataByBuyer(this.buyerValue).subscribe({
      next: (response: any) => {
        console.log(response);
        this.cartData = response;
        this.cartLength = this.cartData.length;
        this.cartTotalAmount = 0;
        this.cartData.forEach((element: any) => {
          this.cartTotalAmount += parseFloat(element.totalPrice);
        });
        this.totalAmount = this.cartTotalAmount;
        this.totalItems = this.cartData.length;
        console.log('new cart Data', response);

        console.log('new cart Data', this.cartData.size);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  selectedPaymentType(type: string) {
    const paymentDiv =
      this.elementRef.nativeElement.querySelectorAll('.payment_card');
    this.isCard = false;
    if (this.payment_method == type) {
      this.payment_method = '';
      for (let i = 0; i < paymentDiv.length; i++) {
        paymentDiv[i].style.backgroundColor = '';
      }
    } else {
      this.payment_method = type;

      // ////console.log(' div', paymentDiv);
      for (let i = 0; i < paymentDiv.length; i++) {
        if (paymentDiv[i].classList.contains(type)) {
          paymentDiv[i].style.backgroundColor = 'rgb(230, 242, 252)';
        } else {
          paymentDiv[i].style.backgroundColor = '';
        }
      }

      if (type == 'CashOn') {
        this.subTotal_text =
          'You can pay in cash to our courier when you receive the goods at your doorstep.';
        this.button_text = 'Confirm Order';
      } else if (type == 'Card') {
        this.isCard = true;
        this.button_text = 'Pay Now';
      } else {
        this.subTotal_text = `Your ${this.payment_method} account ${this.BkashMblNumber} will be charged.`;
        this.button_text = 'Pay Now';
      }
    }
  }

  confirmOrder() {
    this.buyerCode = localStorage.getItem('code');

    console.log(this.userData);
    this.orderdata = {
      userId: parseInt(this.buyerCode),
      address: this.userData.address,
      paymentMethod: 'CashOnDelivery',
      numberOfItem: this.cartData.length,
      totalPrice: this.cartTotalAmount + 100,
      phoneNumber: this.userData.phoneNumber,
      deliveryCharge: 100,
      addedBy: 'me',
      addedPC: 'me',
      orderDetailsList: [],
    };
    console.log(this.orderdata);

    for (const entry of this.cartData) {
      // console.log(entry, ' ----- u');

      const detailData: OrderDetail = {
        companyCode: entry.companyCode,
        productId: parseInt(entry.productID),
        qty: this.cartData.length,
        price: entry.price,
        deliveryCharge: 100,
        deliveryDate: this.getDeliveryDateAndTime(),
        specification: entry.specification,
        productGroupId: entry.productGroupID,
        userId: 0,
        unitId: entry.unitID,
        discountAmount: 0,
        discountPct: 0,
        netPrice: this.cartTotalAmount + 100,
        addedBy: this.buyerCode,
        addedPC: '0.0.0.0',
      };
      this.orderdata.orderDetailsList.push(detailData);
    }

    console.log(this.orderdata);
    this.orderApiService.insertOrderData(this.orderdata).subscribe(
      (response) => {
        if (response.message === 'Order data Inserted Successfully.') {
          alert('Order Placed Successfully!');
          //console.log('success Data Insert');
          // this.cartDataService.clearCartData();
          // this.route.navigate(['/']);
        } else {
          //console.log('not success', response);
        }
      },
      (error) => {
        //  alert('Error try Again');
        //  this.route.navigate(['/cartView']);
        //console.error('Error:', error);
      }
    );
  }
  getDeliveryDateAndTime(): string {
    const currentDate = new Date(); // This will give you the current date and time
    const futureDate = new Date(
      currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
    ); // Adding 7 days in milliseconds
    return futureDate.toISOString(); // Converting to ISO 8601 string format
  }
  getUserInfo() {
    const userId = localStorage.getItem('code');

    this.orderApiService.getUserInfo(userId).subscribe({
      next: (response: any) => {
        this.userData = response.user;
        console.log(' user Data', this.userData);
      },
      error: (error: any) => {
        // Handle the error
        // //console.log(error);
      },
    });
  }
}
