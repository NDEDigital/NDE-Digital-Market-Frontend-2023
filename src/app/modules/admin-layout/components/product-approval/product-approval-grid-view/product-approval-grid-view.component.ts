import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
@Component({
  selector: 'app-product-approval-grid-view',
  templateUrl: './product-approval-grid-view.component.html',
  styleUrls: ['./product-approval-grid-view.component.css'],
})
export class ProductApprovalGridViewComponent {
  @Input() isHovered: any;
  @Input() i: any;
  @Input() row: any;
  @Input() btnIndex: any;
  @Output() checkboxSelectedEvent = new EventEmitter<{
    userId: any;
    companyCode: any;
    productId: any;
    event: any;
  }>();
  @Output() updateProductEvent = new EventEmitter<{
    userId: any;
    companyCode: any;
    productId: any;
    status: any;
  }>();
  @Output() showDetailsEvent = new EventEmitter<{
    row: any;
  }>();

  checkboxSelected(event: {
    userId: any;
    companyCode: any;
    productId: any;
    event: any;
  }) {
    console.log(event);
    this.checkboxSelectedEvent.emit({
      userId: event.userId,
      companyCode: event.companyCode,
      productId: event.productId,
      event: event.event,
    });
  }
  showDetails(row: any) {
    console.log(row);
    this.showDetailsEvent.emit({
      row: row,
    });
  }
  updateProduct(userId: any, companyCode: any, productId: any, status: any) {
    // console.log(event.userId);
    this.updateProductEvent.emit({
      userId: userId,
      companyCode: companyCode,
      productId: productId,
      status: status,
    });
  }
}
