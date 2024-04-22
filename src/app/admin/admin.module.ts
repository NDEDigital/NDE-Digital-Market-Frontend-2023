import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module'; // Admin-specific routing

// Admin components
import { UnitListComponent } from './components/unit-list/unit-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule, // Admin routing
  ],
  declarations: [UnitListComponent],
  exports: [UnitListComponent],
})
export class AdminModule {}
