import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  HostListener,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';

import { catchError, throwError } from 'rxjs';
import { GoodsDataService } from 'src/app/services/goods-data.service';
import { SharedService } from 'src/app/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.css'],
})
export class ProductSliderComponent {
  @ViewChildren('Items') itemsContainers!: QueryList<ElementRef>;

  private intervalIds: any[] = [];
  goods: any;
  goodsArray: any = [];
  sortedProductSize: [string, number][] = [];

  constructor(
    private goodsDataObj: GoodsDataService,
    private sharedService: SharedService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  productLengths: number[] = [];
  productType = new Map();
  groupCode: string = '';
  groupCodes: string = '';
  products = new Map();
  productChildLength: any;
  isWidthGreater: boolean = false;
  products3 = new Map();
  products2 = new Map();
  finalProducts = new Map();
  finalProducts2 = new Map();
  private intervalId: any;
  // private productType=new Map();
  // goods:any;
  sliderData = new Map();
  cnt: number = 0;
  productTitle = '';

  modalTitle: string = 'Decking';
  modalSpec: string = '';
  modalQuantity: string = '';
  modalGroup: string = 'Checkered Plate';
  modalGroupCode: string = '';
  isMouseOverSlider: boolean[] = [true];
  ngOnInit() {
    this.getAllProduct();
  }
  windowWidth: number = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = window.innerWidth;
  }

  getAllProduct() {
    this.products.clear();
    this.goodsDataObj.getCarouselData().subscribe(
      (data: any[]) => {
        this.goods = data;
        console.log(this.goods, 'GGGEEEETTTTTT');
        for (let i = 0; i < this.goods.length; i++) {
          let finObj = this.products3.get(this.goods[i].productGroupCode); // Use productGroupCode as the key

          if (this.goods[i].approveSalesQty === '0') continue;

          if (finObj) {
            let obj = {
              companyCode: this.goods[i].companyCode,
              companyName: this.goods[i].companyName,
              groupCode: this.goods[i].productGroupID,
              goodsId: this.goods[i].productId,
              groupCodes: this.goods[i].productGroupCode,
              groupName: this.goods[i].productGroupName,
              goodsName: this.goods[i].productName,
              specification: this.goods[i].specification,
              approveSalesQty: this.goods[i].availableQty,
              sellerCode: this.goods[i].sellerId,
              unitId: this.goods[i].unitId,
              quantityUnit: this.goods[i].unit,
              imagePath: this.goods[i].imagePath,
              price: this.goods[i].price,
              discountAmount: this.goods[i].discountAmount,
              discountPct: this.goods[i].discountPct,
              netPrice: this.goods[i].totalPrice,
            };
            finObj.push(obj);

            this.products3.set(this.goods[i].productGroupCode, finObj); // Update the map with productGroupCode as key
          } else {
            let obj = {
              companyCode: this.goods[i].companyCode,
              companyName: this.goods[i].companyName,
              groupCode: this.goods[i].productGroupID,
              goodsId: this.goods[i].productId,
              groupName: this.goods[i].productGroupName,
              goodsName: this.goods[i].productName,
              specification: this.goods[i].specification,
              approveSalesQty: this.goods[i].availableQty,
              sellerCode: this.goods[i].sellerId,
              unitId: this.goods[i].unitId,
              quantityUnit: this.goods[i].unit,
              imagePath: this.goods[i].imagePath,
              price: this.goods[i].price,
              discountAmount: this.goods[i].discountAmount,
              discountPct: this.goods[i].discountPct,
              netPrice: this.goods[i].totalPrice,
            };
            this.products3.set(this.goods[i].productGroupCode, [obj]); // Update the map with productGroupCode as key
          }
          console.log(this.products3);
        }
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Handle unauthorized error
          //console.error('Unauthorized Error', error);
        }
        // You can choose to throw an error or handle it differently based on your requirements
        throwError('Error occurred');
      }
    );
  }

  onImageError(event: any): void {
    // If the image is broken or doesn't load, set a fallback source
    event.target.src = '/assets/default-image.jpg';
  }

  viewAllProducts(groupCodes: any) {
    console.log('GROUPCODE::::::::::', groupCodes);
    localStorage.setItem('groupCode', groupCodes);
    this.router.navigate(['/groupProducts']);
  }

  shouldRemoveButton(product: any): boolean {
    // console.log(this.windowWidth, product);
    // console.log(this.windowWidth, product);
    if (this.windowWidth > 1440 && product > 7) {
      return true;
    } else if (this.windowWidth <= 560 && product > 3) {
      // console.log('576 te ashce');
      return true;
    } else if (this.windowWidth <= 576 && product > 3) {
      // console.log('576 te ashce');
      return false;
    } else if (this.windowWidth <= 650 && product >= 4) {
      // console.log('650 te ashce');
      return true;
    } else if (this.windowWidth <= 768 && product > 4) {
      // console.log('768 te ashce');
      return true;
    } else if (this.windowWidth <= 1000 && product > 4) {
      // console.log('1000 te ashce');
      return true;
    } else if (this.windowWidth <= 1200 && product >= 5) {
      return true;
    } else if (this.windowWidth <= 1440 && product >= 5) {
      return true;
    }

    return false;
  }

  updateQuantity() {
    this.intervalId = setInterval(() => {
      this.goodsDataObj.getCarouselData().subscribe((data: any[]) => {
        //console.log(' data error ');
        this.goods = data;

        for (let i = 0; i < this.goods.length; i++) {
          let key =
            this.goods[i].productGroupName && this.goods[i].productGroupID;

          let finObj = this.products3.get(key);
          console.log(finObj);
          if (this.goods[i].approveSalesQty === '0') continue;

          if (finObj) {
            let product = finObj.find(
              (p: any) => p.goodsId === this.goods[i].productId
            );
            if (product) {
              // product.stockQty = this.goods[i].stockQty;
              // product.salesQty = this.goods[i].salesQty;
              product.approveSalesQty = this.goods[i].availableQty;
            }
          }
        }
      });
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId); // Clear the interval using the stored interval ID
    // this.stopAutoSlide();
    // this.isMouseOverSlider = Array(this.itemsContainers.length).fill(false);
  }

  // =============================
  next(index: number): void {
    const itemsContainer = this.itemsContainers.toArray()[index].nativeElement;
    const items = Array.from(itemsContainer.children);

    items.forEach((item: any) => {
      item.style.transition = 'transform .5s ease-in-out';
      item.style.transform = 'translateX(-105%)';

      setTimeout(() => {
        itemsContainer.appendChild(items[0]);
        item.style.transition = 'none';
        item.style.transform = 'translateX(-0.15%)';
      }, 500);
    });
  }

  prev(index: number): void {
    // //console.log('prev');

    const itemsContainer = this.itemsContainers.toArray()[index].nativeElement;
    const items = Array.from(itemsContainer.children);

    // Set initial transform for animation
    items.forEach((item: any) => {
      item.style.transition = 'none';
      item.style.transform = 'translateX(-100%)';
    });

    // Move the last item to the beginning
    itemsContainer.insertBefore(items[items.length - 1], items[0]);

    // Trigger reflow to ensure initial styles are applied

    // void itemsContainer.offsetWidth; // ********** offsetWidth does not work on IIS
    void itemsContainer.getBoundingClientRect().width;

    // Apply transition and final transform for animation
    items.forEach((item: any) => {
      item.style.transition = 'transform .6s ease-in-out';
      item.style.transform = 'translateX(0)';
    });

    // Use setTimeout to remove transition after animation ends
    setTimeout(() => {
      items.forEach((item: any) => {
        item.style.transition = 'none';
      });
    }, 700);
  }

  dataClick(
    title: string,
    specification: string,
    approveSalesQty: string,
    groupName: string,
    groupCode: string
  ) {
    this.modalTitle = title;
    this.modalSpec = specification;
    this.modalQuantity = approveSalesQty;
    this.modalGroup = groupName;
    this.modalGroupCode = groupCode;
  }

  // =========================================================
  // In your component or script file
  splitProductKey(key: string) {
    const trimmedKey = key.trim();
    const parts = trimmedKey.split('GG');
    const firstHalf = parts[0].trim();
    // //console.log(firstHalf);
    return firstHalf;
  }

  navigateToData(detail: any) {
    window.open(
      '/productDetails?productId=' +
        btoa(detail.goodsId) +
        '&companyCode=' +
        btoa(detail.companyCode),
      '_blank'
    );
  }
}
