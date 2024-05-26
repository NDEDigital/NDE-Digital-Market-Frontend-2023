import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-seller-list-grid-view',
  templateUrl: './seller-list-grid-view.component.html',
  styleUrls: ['./seller-list-grid-view.component.css'],
})
export class SellerListGridViewComponent {
  @Input() isHovered!: any;
  @Input() i!: any;
  @Input() sl!: any;
  @Input() userBtnIndex!: any;
  @Input() btnIndex!: any;
  @Output() checkboxSelectedEvent = new EventEmitter<{
    userId: any;
    event: any;
  }>();
  @Output() updatedSellerBuyerEvent = new EventEmitter<{
    userId: any;
    status: any;
  }>();
  checkboxSelected(userId: any, event: any) {
    console.log(event.groupId);
    this.checkboxSelectedEvent.emit({
      userId: userId,
      event: event,
    });
  }
  UpdatedSellerBuyer(userId: any, status: any) {
    this.updatedSellerBuyerEvent.emit({
      userId: userId,
      status: status,
    });
  }
}
