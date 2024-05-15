import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-grid-view',
  templateUrl: './product-grid-view.component.html',
  styleUrls: ['./product-grid-view.component.css'],
})
export class ProductGridViewComponent {
  @Input() product: any;
  @Input() activeProductId: any;
  @Input() isHovered: any;
  @Input() i: any;
  @Input() btnIndex: any;
  @Output() updateIsActiveEvent = new EventEmitter<{
    isActive: any;
    productGroupId: any;
  }>();
  @Output() checkboxSelectedEvent = new EventEmitter<{
    productId: number;
    event: any;
  }>();
  constructor() {
    console.log(this.product);
  }
  updateIsActive(isActive: number, productGroupId: any) {
    // const { isActive, productGroupId } = event;
    this.updateIsActiveEvent.emit({ isActive, productGroupId });
  }
  checkboxSelected(productId: any, event: any) {
    console.log(productId);
    this.checkboxSelectedEvent.emit({
      productId: productId,
      event: event,
    });
  }
}
