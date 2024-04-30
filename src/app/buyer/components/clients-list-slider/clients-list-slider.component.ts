import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { SharedService } from 'src/app/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-clients-list-slider',
  templateUrl: './clients-list-slider.component.html',
  styleUrls: ['./clients-list-slider.component.css'],
})
export class ClientsListSliderComponent {
  @ViewChild('Items', { static: true }) Items!: ElementRef;
  @Input() clients: any;
  private intervalId: any;
  isMouseOverSlider = false;
  getTopSellerData: any;
  selectedProductCode: string = '';
  companyList: any;
  groupCode: string = '';
  groupCodePa: string = '';
  constructor(
    private companyService: CompanyService,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
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
  ngOnInit() {
    this.startAutoSlide();
    this.getTopSeller();
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
    // Only start the auto slide if there are more than 5 items
    if (this.getTopSellerData && this.getTopSellerData.length > 5) {
      this.intervalId = setInterval(() => {
        if (!this.isMouseOverSlider) {
          this.slide();
        }
      }, 3000);
    }
  }

  stopAutoSlide(): void {
    clearInterval(this.intervalId);
  }
  getTopSeller() {
    this.companyService.getTopSeller().subscribe({
      next: (response: any) => {
        //console.log(response);
        this.getTopSellerData = response;
        //console.log(this.getTopSellerData);
      },
      error: (error: any) => {
        //console.log(error);
      },
    });
  }
  productCardClick(company: any) {
    // alert('he')
    this.sharedService.setCompanyCode(company.companyCode);
    //console.log(company, 'companyCode');

    this.router.navigate(['/product'], {
      queryParams: {
        companyCode: btoa(company.companyCode),
        groupCode: btoa(company.productGroupCode),
      },
    });

    // window.location.href = '/product';
  }
  setSelectData() {
    this.router.navigate(['/ourTopSeller'], {});
  }
}
