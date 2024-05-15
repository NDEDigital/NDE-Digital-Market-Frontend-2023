import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-banner-approval-grid-view',
  templateUrl: './banner-approval-grid-view.component.html',
  styleUrls: ['./banner-approval-grid-view.component.css'],
})
export class BannerApprovalGridViewComponent {
  @Input() banner!: any;
  @Input() isHovered!: any;
  @Input() i!: any;
  @Input() btnIndex!: any;

  @Output() truncateDescriptionEvent = new EventEmitter<any>();
  @Output() showImageEvent = new EventEmitter<{ image: any; imageDes: any }>();
  @Output() selectedCompanyCodeValues = new EventEmitter<{
    index: any;
    event: any;
  }>(); // Event emitter for passing data to parent

  truncateDescription(bannerDescription: any) {
    // const { isActive, productGroupId } = event;
    const maxLength = 16;
    console.log('ashce', bannerDescription);
    if (bannerDescription.length > maxLength) {
      return `${bannerDescription.substring(0, maxLength)}...`;
    }
    return bannerDescription;
  }
  showImage(image: any, imageDes: any) {
    // const { isActive, productGroupId } = event;
    // console.log(bannerDescription);
    this.showImageEvent.emit({ image, imageDes });
  }
}
