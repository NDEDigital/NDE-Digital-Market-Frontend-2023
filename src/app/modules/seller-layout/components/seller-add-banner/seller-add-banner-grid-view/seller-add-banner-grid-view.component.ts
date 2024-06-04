import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-seller-add-banner-grid-view',
  templateUrl: './seller-add-banner-grid-view.component.html',
  styleUrls: ['./seller-add-banner-grid-view.component.css'],
})
export class SellerAddBannerGridViewComponent {
  @Input() banner!: any;
  @Input() isHovered!: any;
  @Input() i!: any;
}
