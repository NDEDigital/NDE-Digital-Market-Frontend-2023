import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-status-buttons-component',
  templateUrl: './admin-status-buttons-component.component.html',
  styleUrls: ['./admin-status-buttons-component.component.css'],
})
export class AdminStatusButtonsComponentComponent {
  @Input() btnIndex!: number; // Assuming btnIndex is of type number
  @Output() getProductsEvent = new EventEmitter<number>();

  getProductGroup(groupId: number) {
    this.getProductsEvent.emit(groupId);
  }
}
