import { Component, ElementRef, Input, Output, ViewChild } from '@angular/core';
import { reload } from 'firebase/auth';


import { CompanyService } from 'src/app/services/company.service';
import { EmailService } from 'src/app/services/email.service';
@Component({
  selector: 'app-seller-list',
  templateUrl: './seller-list.component.html',
  styleUrls: ['./seller-list.component.css']
})
export class SellerListComponent {
  isHovered: any | null = null;
  
  buyerResponse:any;
  responseLength:any;
  dropdownValues: any[] = [];
  dropdownValuesWithNames:any[]=[];
  userBtnIndex=0;
  btnIndex = 1;
  sellerList: any;
  whoUser:any;
  imagePath = '';
  imageTitle = 'No Data Found!';
  selectedCompanyCodeValues: { [key: string]: any } = {};
  UserId:any;
  @ViewChild('msgModalBTN') msgModalBTN!: ElementRef;
  @ViewChild('allselected', { static: false }) allSelectedCheckbox!: ElementRef<HTMLInputElement>;

  alertTitle: string = '';
  alertMsg: string = '';
 
  constructor(
    private companyService: CompanyService,
  ) {}
 
  ngOnInit() {

  
    this.UserId=localStorage.getItem('code');
    this.whoUser=localStorage.getItem('role');
 
    if(this.whoUser === 'seller'){
      
      
      this.getData();
    }
    else{
     
      
        this.getSeller();
    }
   this.getDropdownValues();
    
    // alert(this.UserId);
  }
//  currentIndex: number = 0;
//   incrementIndex(): void {
//     this.currentIndex++;
//     alert(this.currentIndex);
//   }
  getData() {
    // console.log("bebe");
    
    this.companyService.GetSellerList(this.btnIndex).subscribe({
      next: (response: any) => {
        // console.log(this.btnIndex);
        // alert(this.btnIndex);
        // console.log("this is the active",response);
       this.sellerList = response.filter((u:any) => u.userId!== Number(this.UserId));   
        //  console.log("btn index is",this.btnIndex);
// console.log("")
         this.responseLength=response.length;
        //  console.log("the response is :",this.responseLength);
         
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  
  selectedValue: any;

  onCategoryChange(event: any): void {
    // Handle the change event here
    this.selectedValue = event.target.value;
    // console.log('Selected value:', this.selectedValue);
  
    // Call getSeller without passing selectedValue as a parameter
    this.getSeller();
  
    // Add your logic here based on the selected value
  }
  
  getSeller(): void {
    // console.log("got in getSeller", this.selectedValue);
    let responseCount = 0;
    
    // Assuming this.btnIndex is defined somewhere in your code
    this.companyService.GetSellerInAdmin(this.btnIndex,this.selectedValue).subscribe({
      next: (response: any) => {
        // console.log(this.btnIndex, "admin", response);
        // console.log("hello helo koi tuii",response);
        this.sellerList = response;
        this.responseLength=response.length;
       
        // console.log("dfladkfja",this.responseLength);
        // console.log(typeof this.responseLength);
        
      },
      error: (error: any) => {
        console.log(error);
      },
      
    });
    // console.log("Total responses received:", responseCount);
  }
  getDropdownValues(): void {
    // Assuming this.btnIndex is defined somewhere in your code
    this.companyService.GetDropdownValues().subscribe({
      next: (response: any) => {
        // console.log("response",response);
        // this.dropdownValues=response;
        //  this.dropdownValues = Array.from(new Set(response.map((item: any) => item.companyCode)));
       /// this.dropdownValuesWithNames =response.filter((item: any) => item.companyCode === targetCompanyCode);

        // this.dropdownValuesWithNames = Array.from(new Set(response.map((item: any) => ({ companyCode: item.companyCode, companyName: item.companyName }))));
        const uniqueCompanyCodesMap = new Map<string, any>();

        // Use the map to filter out objects with duplicate companyCode values
        response.forEach((item:any) => {
          if (!uniqueCompanyCodesMap.has(item.companyCode)) {
            uniqueCompanyCodesMap.set(item.companyCode, item);
          }
        });
        
        // Convert the values of the map to an array to get the final result
         this.dropdownValues = Array.from(uniqueCompanyCodesMap.values());
        // console.log("dropdonwn",this.dropdownValues);

  
       
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  

  

  

getBuyer(){
  this.companyService.GetBuyerInAdmin(this.btnIndex).subscribe({
    next: (response: any) => {
      console.log("btn index is ",this.userBtnIndex);
    
      // console.log("This is ")
      // console.log(this.btnIndex,"getBuyerInAdmin",response);
      this.buyerResponse=response.length;
      // console.log("This is the buyer", this.buyerResponse);
     this.sellerList = response; 

      
       
    },
    error: (error: any) => {
      console.log(error);
    },
  });



}

getBuyerIn(){
  this.getDropdownValues();
this.getBuyer()




}
getSellerIn(){
this.getSeller();
  
}


getUser(){
  if(this.userBtnIndex===1){
    this.getBuyerIn();
  }
  else{
    this.getSellerIn();
  }
}




  UpdatedSellerBuyer(
    userIds: any,
    Isactive: any,
  ) {
   console.log("userIds",userIds);  
   console.log("IsActive",Isactive);
   userIds=userIds.toString();
   console.log("userIds",typeof userIds);  

    this.companyService.UpdateSellerActiveInActive(userIds,Isactive).subscribe({
      next: (response: any) => {
        // console.log(response);
        
     
        if(this.btnIndex === 1&& this.userBtnIndex===1){

          this.alertTitle = "Buyer Deactivation!";
          this.alertMsg = "Buyer is Deactivated Successfully.";
        } 
       else if(this.btnIndex === 1&& this.userBtnIndex===0){

          this.alertTitle = "Seller Deactivation!";
          this.alertMsg = "Seller is Deactivation Successfully.";
        } 
        
        
       else if(this.btnIndex === 0&& this.userBtnIndex===1){

          this.alertTitle = "Buyer Activation!";
          this.alertMsg = "Buyer is Activation Successfully.";
        } 

        
        else{
          this.alertTitle = "Seller Activation!";
          this.alertMsg = "Seller Activation Successfully.";
        } 
      
        this.msgModalBTN.nativeElement.click();  
        
        if(this.whoUser === 'seller'){
          this.getData();
          // console.log('getData');
          }
          else{
            //  this.getSeller();
             this.getUser();
            //  console.log('getSeller')
          }



         
        
          
          
         
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  selectedProductIds: any[] = [];
  selectedProducts1: any[] = [];
  
  selectAll = false;
  toggleAllCheckboxes() {
    console.log("all seelcted",)
    // console.log('Selected Product IDs:', this.selectedProducts1);
  

    // Toggle the state of all checkboxes based on the "Select All" checkbox
    this.sellerList.forEach(
      (product: { isSelected: boolean, userId: any }) => {
        product.isSelected = this.selectAll;
        
        // Update the selectedProducts array based on the state of each checkbox
        if (this.selectAll && !this.selectedProducts1.includes(product.userId)) {
          this.selectedProducts1.push(product.userId);
          
        }
        else if (!this.selectAll && this.selectedProducts1.includes(product.userId)) {
          // Remove the deselected product from the list
          this.selectedProducts1 = this.selectedProducts1.filter(
            (id) => id !== product.userId
          );
          this.selectAll=false;
        
        }
        
      }
    );
   
    
    console.log('Selected Product IDs:', this.selectedProducts1);
    console.log("this.selectedProducts1.length",this.selectedProducts1.length);
    // console.log("this.selectedProducts1.length",this.productList.length);
  
  }
 
  chageActiveInactive(isActive:any){


 
    if(this.selectedProducts1.length>0){
      
// console.log("selectedProducts1",this.selectedProducts1.toString());
// console.log("selectedProducts1",isActive);

      this.companyService.UpdateSellerActiveInActive(this.selectedProducts1.toString(),isActive).subscribe({
        next: (response: any) => {
      
          if(this.btnIndex === 1&& this.userBtnIndex===1){

            this.alertTitle = "Buyer Deactivation!";
            this.alertMsg = "Buyer is Deactivated Successfully.";
          } 
         else if(this.btnIndex === 1&& this.userBtnIndex===0){
  
            this.alertTitle = "Seller Deactivation!";
            this.alertMsg = "Seller is Deactivation Successfully.";
          } 
          
          
         else if(this.btnIndex === 0&& this.userBtnIndex===1){
  
            this.alertTitle = "Buyer Activation!";
            this.alertMsg = "Buyer is Activation Successfully.";
          } 
  
          
          else{
            this.alertTitle = "Seller Activation!";
            this.alertMsg = "Seller Activation Successfully.";
          } 
        
          this.msgModalBTN.nativeElement.click();  
          
          if(this.whoUser === 'seller'){
            this.getData();
            // console.log('getData');
            }
            else{
              //  this.getSeller();
               this.getUser();
              //  console.log('getSeller')
            }
  
  
           this.selectAll=false;
           this.selectedProducts1.length=0;
          // console.log("product id's are",this.selectedProductIds)
        },
        error: (error: any) => {
          //console.log(error);
          this.alertMsg = error.error.message;
        },
      });
    }
    else{
      // this.PrdouctExistModalBTN.nativeElement.click();

      this.alertMsg='No Product is selected'
    }

  }
  
  



  checkboxSelected(productId: any, event: any) {
    const isSelected: boolean = event.target.checked;
// console.log(isSelected);
    if (isSelected && !this.selectedProducts1.includes(productId)) {
      // Add the selected product to the list
      this.selectedProducts1.push(productId);
    } else if (!isSelected && this.selectedProducts1.includes(productId)) {
      // Remove the deselected product from the list
      this.selectedProducts1 = this.selectedProducts1.filter(
        (id) => id !== productId
      );
    }
    this.allSelectedCheckbox.nativeElement.checked=false;
    // Update the selectedProductIds array with the current list of selected product IDs
    this.selectedProductIds = this.selectedProducts1.slice();
  if(this.selectedProducts1.length===this.sellerList.length){
  this.allSelectedCheckbox.nativeElement.checked=true;

}
 console.log("selected areee",this.selectedProducts1);
  }
 
}
