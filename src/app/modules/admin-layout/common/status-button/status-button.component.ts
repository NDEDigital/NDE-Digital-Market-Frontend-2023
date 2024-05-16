import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-status-button',
  templateUrl: './status-button.component.html',
  styleUrls: ['./status-button.component.css'],
})
export class StatusButtonComponent {
  @Input() btnIndex!: any; // Assuming btnIndex is of type number
  @Output() getProductsEvent = new EventEmitter<number>();
  @Output() getProductsFilterEvent = new EventEmitter<number>();
  @Input() SearchTerm!: any;
  @Output() KeyupEvent = new EventEmitter<{ status: any }>();
  @Input() addGroupModalCenter!: string;
  @Input() NewButton!: string;
  @Input() ActiveButton!: string;
  @Input() InactiveButton!: string;
  @Input() AddButtonName!: string;
  @Input() featureName!: string;
  @Input() btnFilter!: any;
  @Input() FilterButton1!: any;
  @Input() FilterButton2!: any;
  constructor() {
    console.log('constructor : ', this.btnIndex);
  }
  getProductGroup(groupId: number) {
    this.getProductsEvent.emit(groupId);
  }

  filterProducts(status: any) {
    console.log('Search : ', status);
    this.KeyupEvent.emit({ status });
  }

  getProductGroupFilter(groupId: number) {
    this.getProductsFilterEvent.emit(groupId);
  }
}
