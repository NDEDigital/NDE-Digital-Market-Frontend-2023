import { Component } from '@angular/core';
import { AddBannerService } from 'src/app/services/add-banner.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  bannerDetails: any[] = []; // Assuming bannerDetails is an array of objects
  leftAdvertisements: any[] = [];
  rightAdvertisements: any[] = [];

  constructor(
    private sharedService: SharedService,
    private bannerServices: AddBannerService
  ) {
    // this.user$.subscribe((user) => {
    //   //console.log(user, 'user');
    // });
  }
  user$ = this.sharedService.user$;
  user: any;
  clients = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  ngOnInit() {
    localStorage.removeItem('activeEntry');
    // const storedUser = localStorage.getItem('loggedInUser');
    // if (storedUser) {
    //   this.user = JSON.parse(storedUser);
    //   //this.sharedService.loggedInUserInfo(this.user); // Update the user info in shared service
    // }

    this.user$.subscribe((user) => {
      // //console.log(user, 'user');
      this.user = user; // Update the user property for use in the component
    });

    this.getAddDetails();
  }

  // hideBanner(index: number) {
  //   console.log('click hocche');
  //   this.bannerDetails[index].showWhyThisAd = true; // Show the "Why This Ad" text
  //   this.bannerDetails[index].hidden = true; // Set flag to hide the image
  // }
  hideBannerAndShowReason(banner: any): void {
    console.log('asche');
    banner.hideClose = true;
    banner.hidden = true;
    banner.showWhyThisAd = true;
  }

  showCloseIcon(index: number): void {
    this.bannerDetails[index].hideClose = false;
  }
  toggleBannerVisibility(banner: any) {
    banner.hidden = !banner.hidden;
    banner.showWhyThisAd = !banner.showWhyThisAd;
    banner.hideClose = false;
  }

  getAddDetails() {
    this.bannerServices.getAddForShowingInHomePage().subscribe({
      next: (response: any) => {
        console.log('Banner Details:', response);
        this.bannerDetails = response;
        this.splitAdvertisements();
      },
      error: (error: any) => {
        console.error('Error Fetching banner Details:', error);
      },
    });
  }
  splitAdvertisements() {
    const numberOfAdsPerSide = 3; // Number of ads to display on each side alternately
    this.leftAdvertisements = [];
    this.rightAdvertisements = [];
    const totalAdsToShow = Math.min(this.bannerDetails.length, 6); // Show maximum 6 ads
    for (let i = 0; i < totalAdsToShow; i++) {
      if (i % (numberOfAdsPerSide * 2) < numberOfAdsPerSide) {
        this.leftAdvertisements.push(this.bannerDetails[i]);
      } else {
        this.rightAdvertisements.push(this.bannerDetails[i]);
      }
    }
  }
}
