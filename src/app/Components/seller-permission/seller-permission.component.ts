import { Component } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { SellerDasboardPermissionService } from 'src/app/services/seller-dasboard-permission.service';


@Component({
  selector: 'app-seller-permission',
  templateUrl: './seller-permission.component.html',
  styleUrls: ['./seller-permission.component.css']
})
export class SellerPermissionComponent {
  selectedValue:any;
  dropdownValues: any[] = [];
  tableData: any[] = [];

  whoUser:any;
  UserId:any;
  sellerList: any;
  responseLength:any;
selectedUserId: any;
selectedMenu: any;

  constructor(
    private companyService: CompanyService,
    private SellerDasboardPermissionService:SellerDasboardPermissionService
  ) {}
  ngOnInit() {
    this.UserId=localStorage.getItem('code');
    this.whoUser=localStorage.getItem('role');

    if(this.whoUser === 'seller'){
      console.log("user id is+",this.UserId);
      
      
      this.getData();
      // this.getDashboarItem();
    }
    this.getPermission();
  
  //  this.getDropdownValues();
    
    // alert(this.UserId);
  }


  getDashboarItem(sellerId:any) {
    console.log("it enter in getboard");
    // console.log("bebe");
    console.log("the getDashoard",  sellerId);
    this.SellerDasboardPermissionService.GetSellerDashboardPermission(sellerId).subscribe({
      next: (response: any) => {
       console.log(response);
         this.dropdownValues=response;
         
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }



  getData() {
    // console.log("it enter in ts");
    // console.log("bebe");
    this.companyService.GetSellerList(1).subscribe({
      next: (response: any) => {
        // console.log(this.btnIndex);
        // alert(this.btnIndex);
       this.sellerList = response.filter((u:any) => u.userId!== Number(this.UserId));   
         console.log(this.sellerList,"this is the data for dropdown");


        //  this.responseLength=response.length
         
         
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  
  onUserChange(userId1:any) {
    
    // Filter dropdownValues based on the selected user
   console.log("the user Id is in onUser +", userId1);
   console.log("first");
   this.getDashboarItem(userId1);
  //  alert(userId1);

  
  }


  PermissionBtn(userId2:any,MenuId:any) {
    console.log("it enter in getboard");
    // console.log("bebe");
   
    this.SellerDasboardPermissionService.GivePermissionToDash(userId2,MenuId).subscribe({
      next: (response: any) => {
       console.log("Response of permission",response);
       this.getPermission();

      //  this.getDashboarItem(userId1);

        
         
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  
  }
  // item:any;
  getPermission() {
    // console.log("it enter in ts");
    // console.log("bebe");
    this.SellerDasboardPermissionService.GetPermissionData(this.UserId).subscribe({
      next: (response: any) => {
      
        console.log("here is the data",response);
  
      const uniqueUserIds = Array.from(new Set(response.map((item:any) => item.userId)));

      // Create a new array with items corresponding to unique user IDs
      const itemsByUserId = uniqueUserIds.map(userId => {
        return {
          userId: userId,
          items: response.filter((item:any) => item.userId === userId),
        };
      });
      
      // console.log("Items by User ID:", itemsByUserId);
      this.tableData=itemsByUserId;
      console.log("this is tableDta",this.tableData);

        //  this.responseLength=response.length
         
         
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }






}
