import { Component } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { SellerDasboardPermissionService } from 'src/app/services/seller-dasboard-permission.service';


@Component({
  selector: 'app-seller-permission',
  templateUrl: './seller-permission.component.html',
  styleUrls: ['./seller-permission.component.css'],
  
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
      
      this.getPermission();
      this.getData();
      // this.getDashboarItem();
    }
 
  
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
  currentIndex: number = 0;
  updateTableData() {
    // Your existing logic to update tableData...
    
    // Increment the index variable
    this.currentIndex++;
  }
  // item:any;
  getPermission() {
    // console.log("it enter in ts");
    // console.log("bebe");
    this.SellerDasboardPermissionService.GetPermissionData(this.UserId).subscribe({
      next: (response: any) => {
     
        this.tableData = response;
console.log(this.tableData);
       
        
    
         
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  
  selectedMenuItems: any = [];
  user:any=[];
  checkboxChanged(userId: any, menuId: any) {
    // Check the state of the checkbox and perform actions accordingly
    const user = this.tableData[userId];
   this.selectedMenuItems = user.filter((menuItem:any) => menuItem.isSelected);




    // Now, selectedMenuItems contains the selected menu items for the given user
    console.log('Selected Menu Items:', this.selectedMenuItems);
  }
  UpdatePermission() {
    console.log("the btn is clicked");

    // Check if selectedMenuItems is undefined or empty before accessing properties
    if (!this.selectedMenuItems || this.selectedMenuItems.length === 0) {
        console.log('No selected menu items');
        return;
    }

    const menuIds: number[] = this.selectedMenuItems.map((item: any) => item.menuId);
  
    // Check if userId is defined before accessing it
    if (!this.selectedMenuItems[0].userId) {
        console.log('No userId in selected menu items');
        return;
    }

    console.log('Selected Menu Items from UpdatePermission:', this.selectedMenuItems[0].userId);
console.log(menuIds)
    // Rest of your code...
    this.SellerDasboardPermissionService.DeleteMenuId(this.selectedMenuItems[0].userId, menuIds).subscribe({
        next: (response: any) => {
            console.log(response);
       this.getPermission();

        },
        error: (error: any) => {
            console.log(error);
        },
    });
}

  
   
}









