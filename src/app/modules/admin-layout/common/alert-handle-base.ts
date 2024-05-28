export class AlertHandleBase {
  isError: boolean = false;
  UserExistModalBTN!: any; // Generic type to be overridden
  alertMsg = '';
  alertTitle: string = '';

  /**
   * Shows alert message and resets the form.
   * @param newStatus New status of the product
   */
  showAlertAndResetForm(newStatus: number): void {
    this.alertMsg = newStatus
      ? 'Product is Activated!'
      : 'Product is Deactivated!';
    this.alertTitle = newStatus ? 'Activated!' : 'Deactivated!';
    this.showModalAndResetForm();
  }

  /**
   * Shows modal and resets the form.
   */
  showModalAndResetForm(): void {
    if (this.UserExistModalBTN && this.UserExistModalBTN.nativeElement) {
      this.UserExistModalBTN.nativeElement.click();
    } else {
      console.error('UserExistModalBTN is not defined or not yet initialized.');
    }
  }

  /**
   * Handles error responses.
   * @param error Error response
   */
  handleErrorResponse(error: any): void {
    this.alertMsg = error.error.message;
    this.isError = true;
    if (this.UserExistModalBTN && this.UserExistModalBTN.nativeElement) {
      this.UserExistModalBTN.nativeElement.click();
    } else {
      console.error('UserExistModalBTN is not defined or not yet initialized.');
    }
  }
}
