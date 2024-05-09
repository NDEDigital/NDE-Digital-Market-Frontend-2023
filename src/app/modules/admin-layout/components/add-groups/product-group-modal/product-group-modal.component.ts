import { Component, Input } from '@angular/core';

import { AddProductService } from 'src/app/services/add-product.service';

@Component({
  selector: 'app-product-group-modal',
  templateUrl: './product-group-modal.component.html',
  styleUrls: ['./product-group-modal.component.css'],
})
export class ProductGroupModalComponent {
  @Input() alertMsg!: string;
  @Input() alertTitle!: string;
  constructor(private addProductService: AddProductService) {}
}
