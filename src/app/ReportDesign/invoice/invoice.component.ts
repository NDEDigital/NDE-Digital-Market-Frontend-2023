import { Component,ElementRef, ViewChild } from '@angular/core';
import { InvoiceService } from 'src/app/services/invoice.service';

import * as jspdf from 'jspdf'
import * as html2pdf from 'html2canvas';


import html2canvas from 'html2canvas';
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent {
  @ViewChild('content', { static: false }) content: ElementRef | undefined;
  orderID = 0;
  invoice: any = [];
  test = 0;
  constructor(private InvoiceService: InvoiceService,private elementRef: ElementRef) {
    const orderIDString = sessionStorage.getItem('orderMasterID');
    if (orderIDString !== null) {
      this.orderID = parseInt(orderIDString, 10);
      // Now, orderID contains the parsed value if it was not null
    } else {
      alert('No order found')!;
    }

    this.InvoiceService.getBuyerInvoice(
      this.orderID
    ).subscribe({
      next: (response: any) => {
        console.log("response.invoice ",response.invoice.orderInvoiceDetailList)
       
          this.invoice = response.invoice;
        
   
      },
      error: (error: any) => {
        //console.log(error);
      },
    });
  }
  ngOnInit() {
    //console.log('aise');
  }

    
  downloadAsPDF() {

    if (this.content) {
      const content = this.content.nativeElement;

      html2canvas(content).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('Invoice.pdf');
      });
    } else {
      console.error('Content element is undefined or not available.');
    }
  }
}
