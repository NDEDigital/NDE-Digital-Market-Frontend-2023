import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-add-price-discounts-grid-view',
  templateUrl: './add-price-discounts-grid-view.component.html',
  styleUrls: ['./add-price-discounts-grid-view.component.css'],
})
export class AddPriceDiscountsGridViewComponent {
  @Input() product!: any;
  @Input() activeProductPriceId!: any;
  @Input() isHovered: any | null = null;
  @Input() i!: number;
}
