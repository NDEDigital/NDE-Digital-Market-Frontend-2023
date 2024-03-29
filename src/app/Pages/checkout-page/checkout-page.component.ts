import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CartDataService } from 'src/app/services/cart-data.service';
import { CartItem } from '../cart-added-product/cart-item.interface';
import { Router } from '@angular/router';
import { OrderApiService } from 'src/app/services/order-api.service';
import { SslPaymentService } from 'src/app/services/ssl-payment.service';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css'],
})
export class CheckoutPageComponent {
  checkoutForm: FormGroup;
  editMode = false;
  productList: any = [1, 2, 3];
  cartDataDetail = new Map<string, CartItem>();
  cartDataQt = new Map<string, number>();
  totalPrice:number = 0;
  deliveryFee = 100;
  userData: any;
  totalPriceWithDiscount:number = 0;
  // tushar code
  urlParams = new URLSearchParams(window.location.search);
  message = this.urlParams.get('message');
  timestamp: any;
  randomComponent: any;
  uniqueString: any;
  userName = '';
  constructor(
    private fb: FormBuilder,
    private cartDataService: CartDataService,
    private route: Router,
    private orderService: OrderApiService,
    private SSLPayment: SslPaymentService
  ) {
    this.checkoutForm = this.fb.group({
      phone: [{ value: '01745671968', disabled: true }, [Validators.required]],
      email: [{ value: 'email@gmail.com', disabled: true }, [Validators.email]],
      address: [
        { value: 'Banani, Dhaka, Bangladesh', disabled: true },
        [Validators.required, this.addressValidator],
      ],
    });
  }

  ngOnInit() {
    const cartData = this.cartDataService.getCartData();
    this.cartDataDetail = cartData.cartDataDetail;
    this.cartDataQt = cartData.cartDataQt;
    this.totalPriceWithDiscount = this.cartDataService.getTotalPrice();
    // console.log(this.cartDataDetail," cartDataDetal");
    // console.log(this.cartDataQt," cartDataDetal");
    
    this.getUserInfo();
    // setTimeout(() => {
    //   //console.log(" usaer dataaaaaaaaaa",this.userData )
    //    this.setUserInfo();

    // }, 90);
    for(let entry of this.cartDataDetail){
      let Qty = Number(this.cartDataQt.get(entry[0]));
      let price =  parseFloat(entry[1].price);
     
      if (typeof Qty === 'number') {
          this.totalPrice += (Qty * price);
      }
        //  console.log(typeof Qty, Qty ,price);
         
    }

    // by tushar
    if (this.message) {
      alert(this.message);
      this.route.navigate(['/buyerOrder']);
      //  this.confirmOrder();
    }
  }
  confirmOrder() {
    this.orderService.insertOrderData().subscribe(
      (response) => {
        if (response.message === 'Order data Inserted Successfully.') {
          alert('Order Placed Successfully!');
          //console.log('success Data Insert');
          this.cartDataService.clearCartData();
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

  editInfo() {
    this.editMode = true;
    // if (str === 'phone') {
    this.checkoutForm.get('phone')?.enable();
    // } else {
    this.checkoutForm.get('address')?.enable();
    // }
  }
  saveInfo() {
    let addressValue, phoneValue;
    // if (str === 'phone') {
    if (this.editMode && this.checkoutForm.valid) {
      if (this.checkoutForm.value.phone !== '') {
        phoneValue = this.checkoutForm.value.phone.trim();
        this.orderService.setPhone(this.checkoutForm.value.phone);
        this.checkoutForm.get('phone')?.disable();
      }
      // else {
      //   alert('Please insert a valid phone number');
      // }
      // } else {

      if (this.checkoutForm.value.address !== '') {
        addressValue = this.checkoutForm.value.address.trim();
        this.orderService.setAddress(this.checkoutForm.value.address);
        this.checkoutForm.get('address')?.disable();
      }

      this.editMode = false;
    }
  }

  // Define the custom validator function
  addressValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const value = control.value as string;

    if (value && value.trim() === '') {
      return { spacesOnly: true }; // Validation failed
    }

    return null; // Validation passed
  }

  isFieldInvalid(fieldName: string) {
    const field = this.checkoutForm.get(fieldName);
    // return field?.invalid && field.touched;
    return field?.invalid && field.touched && field.dirty;
  }
  payment() {
    // this.cartDataService.setTotalPriceWithDelivery(
    //   this.totalPrice + this.deliveryFee
    // );
    // this.route.navigate(['/payment']);

    // Tushar code
    this.timestamp = Date.now().toString(36);
    this.randomComponent = Math.random().toString(36).substr(2, 5);
    this.uniqueString = this.timestamp + this.randomComponent;
    this.confirmOrder();
    this.SSLPayment.postPaymentAPI(this.totalPriceWithDiscount, this.uniqueString);
    this.SSLPayment.callApi(
      this.cartDataDetail.size,
      this.totalPriceWithDiscount,
      this.uniqueString
    );
  }
  getUserInfo() {
    const userId = localStorage.getItem('code');

    this.orderService.getUserInfo(userId).subscribe({
      next: (response: any) => {
        this.userData = response.user;
        //console.log(' user Data', this.userData);
        this.userName = this.userData.fullName;
        this.setUserInfo();
      },
      error: (error: any) => {
        // Handle the error
        // //console.log(error);
      },
    });
  }
  setUserInfo() {
    if (this.checkoutForm) {
      this.checkoutForm.patchValue({
        phone: this.userData ? this.userData.phoneNumber : '',
        email: this.userData ? this.userData.email : '',
        address: this.userData ? this.userData.address : '',
      });
      this.orderService.setPhone(this.userData.phoneNumber);
      this.orderService.setAddress(this.userData.address);
    }
  }
}
