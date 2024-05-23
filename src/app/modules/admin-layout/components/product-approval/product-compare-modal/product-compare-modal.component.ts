import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-compare-modal',
  templateUrl: './product-compare-modal.component.html',
  styleUrls: ['./product-compare-modal.component.css'],
})
export class ProductCompareModalComponent {
  @Input() selectedProduct!: any;
}
