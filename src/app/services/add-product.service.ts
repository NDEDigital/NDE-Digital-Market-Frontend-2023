import { Injectable } from '@angular/core';
import { API_URL } from '../config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs'; // Import Observable from 'rxjs'
@Injectable({
  providedIn: 'root',
})
export class AddProductService {
  URL = API_URL;
  // URL = 'https://localhost:7006';
  // URL = 'http://172.16.5.18:8081'; // liveURL

  getAddQuantityDatabyUserId = `${this.URL}/ProductQuantity/GetPortalReceivedByUserId`;
  getProductGroupByUserIdURL = `${this.URL}/ProductQuantity/ProductGroupsDropdownByUserId`;
  GetPortalDataURL = `${this.URL}/ProductQuantity/GetPortalData`;
  getdetailsData = `${this.URL}/ProductQuantity/GetProductForAddQtyByUserId`;

  updateProductGroupURL = `${this.URL}/api/ProductGroups/UpdateProductGroups`;

  private postData = `${this.URL}/ProductQuantity/PortalReceivedPost`;
  createProductGroupURL = `${this.URL}/api/ProductGroups/CreateProductGroups`;

  getProductGropURL = `${this.URL}/api/ProductGroups/GetProductGroupsList`;
  GetProductGroupsListByStatusURL = `${this.URL}/api/ProductGroups/GetProductGroupsListByStatus`;
  GetProductListByStatusURL = `${this.URL}/api/ProductList/GetProductListByStatus`;

  getUnitURL = `${this.URL}/api/HK_Gets/GetUnitList`;

  GetProductDataURL = `${this.URL}/GetSellerProductForAdminApproval`;
  getAllproducts = `${this.URL}/api/ProductList/GetProductList`;

  createProductListURL = `${this.URL}/api/ProductList/CreateProductList`;
  updateProductURL = `${this.URL}/SellerProductStatusUpdate`;
  updateProductStatusURL = `${this.URL}/api/ProductList/MakeProductActiveOrInactive`;
  updateProductGroupStatusURL = `${this.URL}/api/ProductGroups/MakeGroupActiveOrInactive`;

  CreateSellerProductPriceURL = `${this.URL}/ProductQuantity/CreateSellerProductPriceAndOffer`;
  GetProductsByStatusURL = `${this.URL}/ProductQuantity/GetSellerProductsByCompanyCode`;

  updateProductListURL = `${this.URL}/api/ProductList/UpdateProductList`;

  updateSellerProductPriceURL = `${this.URL}/ProductQuantity/UpdateSellerProductPriceAndOffer`;

  GetProductNameByProductGroupIdURL = `${this.URL}/api/ProductList/GetProductNameByProductGroupId`;

  constructor(private http: HttpClient) {}

  createProductGroup(productData: any) {
    return this.http.post(this.createProductGroupURL, productData);
  }

  GetAddQuantityDataByUserId(userId: any) {
    return this.http.get(this.getAddQuantityDatabyUserId, {
      params: { userId },
    });
  }
  GetPortalData(PortalReceivedId: any) {
    return this.http.get(this.GetPortalDataURL, {
      params: { PortalReceivedId },
    });
  }

  getProductGroupsByUserId(userID: any) {
    return this.http.get(`${this.getProductGroupByUserIdURL}/${userID}`);
  }

  // get dfetails data
  GetProductDetailsData(CompanyCode: any, productGroupId: any) {
    return this.http.get(
      `${this.getdetailsData}/${CompanyCode}/${productGroupId}`
    );
  }

  // post data
  insertPortalReceived(portalData: any): Observable<any> {
    return this.http.post<any>(`${this.postData}`, portalData);
  }
  // seller product data
  getProductData(status: string) {
    return this.http.get(this.GetProductDataURL, {
      params: { status },
    });
  }
  GetProductGroupsListByStatus(status: any) {
    if (status === -1) {
      return this.http.get(this.GetProductGroupsListByStatusURL);
    } else {
      return this.http.get(this.GetProductGroupsListByStatusURL, {
        params: { status },
      });
    }
  }
  GetProductListByStatus(status: any) {
    if (status === -1) {
      return this.http.get(this.GetProductListByStatusURL);
    } else {
      return this.http.get(this.GetProductListByStatusURL, {
        params: { status },
      });
    }
  }
  GetProductsByStatus(userID: any, status: any) {
    return this.http.get(this.GetProductsByStatusURL, {
      params: { userID, status },
    });
  }

  getProductGroups() {
    return this.http.get(this.getProductGropURL);
  }

  getUnitGroups() {
    return this.http.get(this.getUnitURL);
  }

  GetProductByGroupName(ProductGroupId: number){
    return this.http.get(this.GetProductNameByProductGroupIdURL, {
      params: {ProductGroupId},
    });
  }

  createProductList(productStatus: any) {
    return this.http.post(this.createProductListURL, productStatus);
  }
  updateProduct(productListData: any) {
    return this.http.put(this.updateProductURL, productListData);
  }
  // updateProductStatus(productId: any, IsActive: any) {
  //   console.log(productId, IsActive, 'service prduct is active');
  //   return this.http.put(this.updateProductStatusURL, {
  //     params: { productId, IsActive },
  //   });
  // }
  updateProductStatus(productIds: number[], IsActive: any) {
    // console.log("product Id's are",productIds);
    // console.log("IsActive are",IsActive);
    // Convert IsActive to boolean
    const convertedIsActive = IsActive === 1 ? true : false;

    console.log(productIds, convertedIsActive, 'service product is active');

    // Construct the URL with IsActive parameter
    const url = `${this.updateProductStatusURL}?IsActive=${convertedIsActive}`;

    return this.http.put(
        url,
        productIds // Pass productIds as the request body
    );
}



  updateProductGroupStatus(groupIds: any, IsActive: any) {
    // Convert IsActive to boolean
    // const convertedIsActive = IsActive === 1 ? true : false;

    // console.log(groupIds, convertedIsActive, 'service product is active');
    // console.log("active are",IsActive);
    // console.log("group id's are ",groupIds)

    return this.http.put(
      `${this.updateProductGroupStatusURL}?groupIds=${groupIds}&IsActive=${IsActive}`,
      {}
    );
  }
  updateProductGroup(groupListData: any) {
    return this.http.put(this.updateProductGroupURL, groupListData);
  }

  updateProductList(productListData: any) {
    return this.http.put(this.updateProductListURL, productListData);
  }

  getallProducts() {
    return this.http.get(this.getAllproducts);
  }

  updateSellerProductPrice(ProductPrice: any) {
    return this.http.put(this.updateSellerProductPriceURL, ProductPrice);
  }

  createSellerProductPrice(productListInsertData: any) {
    return this.http.post(
      this.CreateSellerProductPriceURL,
      productListInsertData
    );
  }
}
