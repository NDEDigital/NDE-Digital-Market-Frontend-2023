import { Component } from '@angular/core';
import { AddBannerService } from 'src/app/services/add-banner.service';
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
})
export class BannerComponent {
  bannerDetails: any;
  constructor(private bannerServices: AddBannerService) {
    this.getBannerDetails();
  }
  getBannerDetails() {
    this.bannerServices.getBannerForShowingInHomePage().subscribe({
      next: (response: any) => {
        console.log('Banner Details:', response);
        this.bannerDetails = response;
        console.log(this.bannerDetails);
      },
      error: (error: any) => {
        console.error('Error Fetching banner Details:', error);
      },
    });
  }
}
