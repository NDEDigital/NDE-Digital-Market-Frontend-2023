import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  HostListener,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';
import { AddBannerService } from 'src/app/services/add-banner.service';

import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-ad-slider',
  templateUrl: './ad-slider.component.html',
  styleUrls: ['./ad-slider.component.css'],
})
export class AdSliderComponent {
  bannerDetails: any[] = []; // Assuming bannerDetails is an array of objects
  leftAdvertisements: any[] = [];
  rightAdvertisements: any[] = [];

  constructor(
    private sharedService: SharedService,
    private bannerServices: AddBannerService
  ) {}

  ngOnInit() {
    this.getAddDetails();
  }
  showCloseIcon(index: number): void {
    this.bannerDetails[index].hideClose = false;
  }
  getClass(index: number): string {
    switch (index) {
      case 0:
        return 'item item-1';
      case 1:
        return 'item item-2';
      case 2:
        return 'item item-3';
      case 3:
        return 'item item-4';
      default:
        return '';
    }
  }

  toggleBannerVisibility(banner: any) {
    banner.hidden = !banner.hidden;
    banner.showWhyThisAd = !banner.showWhyThisAd;
    banner.hideClose = false;
  }
  hideBannerAndShowReason(banner: any): void {
    console.log('asche');
    banner.hideClose = true;
    banner.hidden = true;
    banner.showWhyThisAd = true;
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
    const totalAdsToShow = Math.min(this.bannerDetails.length, 4); // Show maximum 6 ads
    this.leftAdvertisements = [];

    for (let i = 0; i < totalAdsToShow; i++) {
      this.leftAdvertisements.push(this.bannerDetails[i]);

      // } else {
      //   this.rightAdvertisements.push(this.bannerDetails[i]);
      // }
    }
  }
}

