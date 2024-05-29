import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-banner-approval-image-view-modal',
  templateUrl: './banner-approval-image-view-modal.component.html',
  styleUrls: ['./banner-approval-image-view-modal.component.css'],
})
export class BannerApprovalImageViewModalComponent {
  @Input() imagePath!: any;
  @Input() imageTitle!: any;
}
