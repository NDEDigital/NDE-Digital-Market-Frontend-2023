import { Component } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';


@Component({
  selector: 'app-seller-permission',
  templateUrl: './seller-permission.component.html',
  styleUrls: ['./seller-permission.component.css']
})
export class SellerPermissionComponent {
  selectedValue:any;
  dropdownValues: any[] = [];
  whoUser:any;
  UserId:any;
  sellerList: any;
  responseLength:any;

  constructor(
    private companyService: CompanyService,
  ) {}
  ngOnInit() {
    this.UserId=localStorage.getItem('code');
    this.whoUser=localStorage.getItem('role');

    if(this.whoUser === 'seller'){
      console.log("user id is+",this.UserId);
      
      
      this.getData();
    }
  
  //  this.getDropdownValues();
    
    // alert(this.UserId);
  }
  getData() {
    console.log("it enter in ts");
    // console.log("bebe");
    this.companyService.GetSellerList(1).subscribe({
      next: (response: any) => {
        // console.log(this.btnIndex);
        // alert(this.btnIndex);
       this.sellerList = response.filter((u:any) => u.userId!== Number(this.UserId));   
         console.log(this.sellerList,"this is the data for dropdown");

         this.responseLength=response.length
         
         
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }


}
