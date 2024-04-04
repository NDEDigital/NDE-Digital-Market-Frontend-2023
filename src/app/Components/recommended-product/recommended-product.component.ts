import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { SharedService } from 'src/app/services/shared.service';
import { RecommendedProductService } from 'src/app/services/recommended-product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recommended-product',
  templateUrl: './recommended-product.component.html',
  styleUrls: ['./recommended-product.component.css'],
})
export class RecommendedProductComponent {
  @ViewChild('Items', { static: true }) Items!: ElementRef;
  @Input() clients: any;
  private intervalId: any;
  isMouseOverSlider = false;
  getTopSellerData: any;
  selectedProductCode: string = '';
  companyList: any;
  groupCode: string = '';
  groupCodePa: string = '';
  productId: string = '';
  companyCode: string = '';

  // ... constructor remains the same ...
  constructor(
    private companyService: CompanyService,
    private sharedService: SharedService,
    private recommendedServices: RecommendedProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    // Subscribe to queryParams to get productId and companyCode
    this.route.queryParams.subscribe((params) => {
      if (params['productId']) {
        // Assuming productId is encoded and needs to be decoded
        this.productId = atob(params['productId']);
      }
      if (params['companyCode']) {
        // Assuming companyCode is encoded and needs to be decoded
        this.companyCode = atob(params['companyCode']);
      }
      this.startAutoSlide();
      this.getRecommendedProduct(this.companyCode, this.productId);
      console.log('Product ID:', this.productId);
      console.log('Company Code:', this.companyCode);
    });
  }

  onMouseEnter() {
    this.isMouseOverSlider = true;
    // console.log(this.isMouseOverSlider, 'this.isMouseOverSlider');
    this.stopAutoSlide();
  }

  onMouseLeave() {
    this.isMouseOverSlider = false;
    // console.log(this.isMouseOverSlider, 'this.isMouseOverSlider');
    if (!this.isMouseOverSlider) {
      this.startAutoSlide();
    }
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  slide(): void {
    const itemsContainer = this.Items.nativeElement;
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
  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      if (!this.isMouseOverSlider) {
        // console.log(this.isMouseOverSlider, 'this.isMouseOverSlider');

        this.slide();
      }
    }, 3000);
  }
  stopAutoSlide(): void {
    clearInterval(this.intervalId);
  }
  getRecommendedProduct(companyCode: any, productId: any) {
    this.recommendedServices
      .GetRecommendedProductDetailsData(companyCode, productId)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.getTopSellerData = response;
          console.log(this.getTopSellerData);
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }
  productCardClick(product: any) {
    // alert('he')
    this.sharedService.setCompanyCode(product.companyCode);
    console.log(product, 'companyCode');

    window.open(
      '/productDetails?productId=' +
        btoa(product.productId) +
        '&companyCode=' +
        btoa(product.companyCode),
      '_blank'
    );

    // window.location.href = '/product';
  }
}
