import { Component, Input } from '@angular/core';

import { AddProductService } from 'src/app/services/add-product.service';
@Component({
  selector: 'app-dynamic-alert-modal',
  templateUrl: './dynamic-alert-modal.component.html',
  styleUrls: ['./dynamic-alert-modal.component.css'],
})
export class DynamicAlertModalComponent {
  @Input() alertMsg!: string;
  @Input() alertTitle!: string;
  @Input() id!: string;
  constructor(private addProductService: AddProductService) {}
}
