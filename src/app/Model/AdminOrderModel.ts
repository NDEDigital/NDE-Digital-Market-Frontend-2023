export interface AdminOrderModel {
  // employeeId: number;
  // LeaveProcessStatus: string;
  orderMasterId: number;
  orderNo: string;
  orderDate: string;
  SellerCode: string;
  address: string;
  BuyerCode: string;
  paymentMethod: string;
  orderPlaceDate: string;
  numberOfItem: string;
  totalPrice: string;

  status: string;
  totalRowsCount: number;
  approvedCount: number;
  cancelledCount: number;
  deliveredCount: number;
  pendingCount: number;
  returnedCount: number;
  readyToShipCount: number;
  shippedCount: number;

  // return
  goodsName: string;
  groupName: string;
  goodsId: number;
  price: string;
  remarks: string;
  returnId: string;
  typeId: string;
  applyDate: string;
  deliveryDate: string;
  detailsId: string;
  returnType: string;
  toReturnCount : number;


  // details

  //orderMasterId: number; // Assuming orderMasterId is of type number
  isChecked: boolean;   // Assuming isChecked is of type boolean
}
