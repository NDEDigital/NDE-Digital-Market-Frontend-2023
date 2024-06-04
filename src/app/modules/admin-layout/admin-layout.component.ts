import { Component, HostListener } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';
import { SellerDasboardPermissionService } from 'src/app/services/seller-dasboard-permission.service';
import { PROJECT_TITLE } from 'src/app/config';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
})
export class AdminLayoutComponent {
  showSidebar = true;
  isAdmin: boolean = false;
  isBuyer: boolean = false;
  isSeller: boolean = false;
  sellerCode: any;
  activeButton: string | null = 'new';
  status: string | null = 'new';

  publicIP = '0.0.0.0';
  currentPage: number = 0;
  isLoggedIn = false;
  userPermission: any[] = [];
  projectTitle = '';

  userId: any;
  companyAdminId: any;
  AdminStatus: any;
  loading: boolean = false;
  private subscription: Subscription;

  constructor(
    private sharedService: SharedService,
    private SellerDasboardPermissionService: SellerDasboardPermissionService
  ) {
    this.sellerCode = localStorage.getItem('code');
    fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((data) => {
        this.publicIP = data.ip;
      });
    this.subscription = this.sharedService.loginStatus$.subscribe(
      (loginStatus) => {
        this.isLoggedIn = loginStatus;
      }
    );
  }

  ngOnInit() {
    this.projectTitle = PROJECT_TITLE;

    this.companyAdminId = localStorage.getItem('isDigitalCompanyAd');
    this.userId = localStorage.getItem('code');
    this.getPermissionUser();
    setTimeout(() => {
      const role = localStorage.getItem('role');
      this.isAdmin = role === 'admin';
      this.isSeller = role === 'seller';
      this.isBuyer = role === 'buyer';
    }, 15);
    this.toggleSidebar();
  }

  getPermissionUser() {
    this.AdminStatus = this.companyAdminId === 'true' ? 1 : 0;
    this.SellerDasboardPermissionService.getUserPermission(
      this.userId,
      this.AdminStatus
    ).subscribe({
      next: (response: any) => {
        this.userPermission = response;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.toggleSidebar();
  }

  toggleSidebar() {
    this.showSidebar = window.innerWidth >= 547;
  }
}
