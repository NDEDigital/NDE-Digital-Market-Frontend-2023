import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-status-buttons-component',
  templateUrl: './status-buttons-component.component.html',
  styleUrls: ['./status-buttons-component.component.css'],
})
export class StatusButtonsComponentComponent {
  @Input() btnIndex!: number; // Assuming btnIndex is of type number
  @Output() getProductsEvent = new EventEmitter<number>();

  getProducts(groupId: number) {
    this.getProductsEvent.emit(groupId);
  }
}
