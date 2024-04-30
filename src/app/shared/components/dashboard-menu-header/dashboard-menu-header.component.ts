import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-menu-header',
  templateUrl: './dashboard-menu-header.component.html',
  styleUrls: ['./dashboard-menu-header.component.css'],
})
export class DashboardMenuHeaderComponent {
  @Input() title: string = 'Default Title';
}
