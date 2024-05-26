import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-brands-grid-view',
  templateUrl: './brands-grid-view.component.html',
  styleUrls: ['./brands-grid-view.component.css'],
})
export class BrandsGridViewComponent {
  @Input() brand!: any;
  @Input() isHovered!: any;
  @Input() i!: any;
  @Input() activeGroupId!: any;
  @Input() btnIndex!: any;
  @Output() checkboxSelectedEvent = new EventEmitter<{
    brandId: any;
    event: any;
  }>();
  @Output() updateIsActiveEvent = new EventEmitter<{
    status: any;
    brandId: any;
  }>();
  checkboxSelected(brandId: any, event: any) {
    console.log(brandId);
    this.checkboxSelectedEvent.emit({
      brandId: brandId,
      event: event,
    });
  }
  updateIsActive(status: any, brandId: any) {
    this.updateIsActiveEvent.emit({
      status: status,
      brandId: brandId,
    });
  }
}
