import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnitListComponent } from './components/unit-list/unit-list.component';

const routes: Routes = [{ path: 'unit-list', component: UnitListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
