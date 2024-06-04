import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-company-trade-licence-modal',
  templateUrl: './company-trade-licence-modal.component.html',
  styleUrls: ['./company-trade-licence-modal.component.css'],
})
export class CompanyTradeLicenceModalComponent {
  @Input() imageTitle!: any;
  @Input() imagePath!: any;
}
