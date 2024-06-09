import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CartDataService } from 'src/app/services/cart-data.service';
@Component({
  selector: 'app-cart-list-side-bar',
  templateUrl: './cart-list-side-bar.component.html',
  styleUrls: ['./cart-list-side-bar.component.css'],
})
export class CartListSideBarComponent implements OnInit {
  @Input() cartData: any;
  @Input() cartTotalAmount: any;
  @Output() cartUpdated = new EventEmitter<void>(); // Emitting an event when the cart is updated

  constructor(private cartDataService: CartDataService) {}

  ngOnInit(): void {
    // Initialization logic here
    // console.log(
    //   'Component initialized with cart data:',
    //   this.cartData ? this.cartData : 0
    // );
  }
  deleteFromSideCart(entry: any) {
    console.log(entry, 'ashce');
    this.cartDataService.deleteCartDataByBuyer(entry.id).subscribe({
      next: (response: any) => {
        console.log(response);
        this.cartUpdated.emit();
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
}
