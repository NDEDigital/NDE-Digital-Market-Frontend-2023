import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-seller-inventory-grid-view',
  templateUrl: './seller-inventory-grid-view.component.html',
  styleUrls: ['./seller-inventory-grid-view.component.css'],
})
export class SellerInventoryGridViewComponent {
  @Input() isHovered: any;
  @Input() i!: number;
  @Input() inventory!: any;
  @Input() activeGroupId!: number | null;
}
