import { Component } from '@angular/core';
import { AddBannerService } from 'src/app/services/add-banner.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  bannerDetails: any;
  constructor(
    private sharedService: SharedService,
    private bannerServices: AddBannerService
  ) {
    // this.user$.subscribe((user) => {
    //   //console.log(user, 'user');
    // });

    this.getAddDetails();
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
  }

  getAddDetails() {
    this.bannerServices.getAddForShowingInHomePage().subscribe({
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
