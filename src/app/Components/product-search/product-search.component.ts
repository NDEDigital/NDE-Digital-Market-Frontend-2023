import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css'],
})
export class ProductSearchComponent {
  @Input() productData: any;
  @Output() dataEvent = new EventEmitter<any>();
  @Input() indx: any;
  @Input() compare: string = '';
  @Input() totalSize: any;

  constructor(private router: Router) {}

  ngOnInit(): void {}
  sendData() {
    const data = {
      ind: this.indx,
    };
    this.dataEvent.emit(data);
  }
  goContactSupplier() {
    this.router.navigate(['/contactSupplierComponent']);
  }
  viewDetail() {
    
    // sessionStorage.setItem('productData', JSON.stringify(this.productData));
    // this.route.navigate(['/productDetails']);
    window.open('/productDetails?productId='+btoa(this.productData.goodsId)+'&companyCode='+btoa(this.productData.companyCode), '_blank');

  }
}
