import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-seller-inventory-search',
  templateUrl: './seller-inventory-search.component.html',
  styleUrls: ['./seller-inventory-search.component.css'],
})
export class SellerInventorySearchComponent {
  @Input() placeholder!: string;
  @Input() searchby!: string;
  @Input() SearchByname!: string;
  @Input() searchInputValue!: string;
  @Output() searchIconEvent = new EventEmitter<void>();
  @Output() setSearchOptionEvent = new EventEmitter<{ searchByname: string }>();
  @Output() keyupEvent = new EventEmitter<{ event: any }>();

  searchIcon() {
    console.log(this.searchInputValue);
    this.keyupEvent.emit({ event: this.searchInputValue });
  }

  setSearchOption(searchByname: string) {
    this.setSearchOptionEvent.emit({ searchByname });
  }

  onKeyUp(value: any) {
    console.log('Search : ', value);
    this.keyupEvent.emit({ event: value });
  }
}
