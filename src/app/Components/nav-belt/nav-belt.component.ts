import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { GoodsDataService } from '../../services/goods-data.service';
import { NavigationEnd, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-belt',
  templateUrl: './nav-belt.component.html',
  styleUrls: ['./nav-belt.component.css'],
})
export class NavBeltComponent implements OnInit {
  @ViewChild('navItems', { static: true }) navItems!: ElementRef;
  @ViewChild('navItem', { static: true }) navItem!: ElementRef;
  @Output() dataUpdated = new EventEmitter<void>();
  private navDataSubscription: Subscription;
  products = new Map();
  // productType = new Map();
  products2 = new Map();
  // productType2 = new Map();
  goods: any;
  goods2: any;
  sliderData = new Map();
  sliderData2 = new Map();
  activeEntry: string = '';
  imgProduct = new Map();

  constructor(
    private goodsData: GoodsDataService,
    private sharedService: SharedService,
    private router: Router
  ) {
    this.navDataSubscription = new Subscription();
  }

  ngOnInit() {
    this.activeEntry = localStorage.getItem('activeEntry') || '';
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/') {
          localStorage.removeItem('activeEntry');
        }
      }
    });

    this.loadData();
  }

  loadData(): void {
    this.navDataSubscription = this.goodsData
      .getNavData()
      .subscribe((data: any[]) => {
        this.goods = data;
        // Check if goods array is not empty
        if (this.goods && this.goods.length > 0) {
          for (let i = 0; i < this.goods.length; i++) {
            this.products.set(
              this.goods[i].productGroupCode,
              this.goods[i].productGroupName
            );
            this.imgProduct.set(
              this.goods[i].productGroupCode,
              this.goods[i].imagePath
            );
          }
          this.getDynamicWidthClass(); // This function will be called after the for loop
        }
      });
  }

  getDynamicWidthClass(): string {
    let productCount = 0;
    if (this.goods && this.goods.length > 0) {
      productCount = this.goods.length;
    }
    // console.log(productCount, "sjdfhjdf");

    if (productCount <= 3) {
      return 'w-25';
    } else if (productCount <= 7) {
      return 'w-50';
    } else {
      return 'w-75';
    }
  }

  // shouldShowButtons(): boolean {
  //   return this.products.size > 7;
  // }

  setSelectData(groupCode: string, groupName: string) {
    this.sharedService.setNavSelectData(groupCode, groupName);

    this.dataUpdated.emit();
    // Update active entry
    this.activeEntry = groupName;

    localStorage.setItem('activeEntry', this.activeEntry);
    this.router.navigate(['/productsPageComponent']);
    // //console.log(this.activeEntry, 'activeEntry');
  }

  next(): void {
    this.navItems.nativeElement.appendChild(
      this.navItems.nativeElement.children[0]
    );
  }
  prev(): void {
    const allNavItems = this.navItems.nativeElement.children;
    const firstNavItem = allNavItems[0];
    const lastNavItem = allNavItems[allNavItems.length - 1];
    this.navItems.nativeElement.insertBefore(lastNavItem, firstNavItem);
    // //console.log('hello prev');
  }
  ngOnDestroy() {
    // Unsubscribe when the component is destroyed
    if (this.navDataSubscription) {
      this.navDataSubscription.unsubscribe();
    }
  }
}
