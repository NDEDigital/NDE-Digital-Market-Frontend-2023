import { Component } from '@angular/core';
import { PROJECT_TITLE } from 'src/app/config';
@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css'],
})
export class UserRegistrationComponent {
  projectTitle = '';

  ngOnInit() {
    this.projectTitle = PROJECT_TITLE;
  }
}
