import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage.component';
import { RouterModule, Routes } from '@angular/router';
import { SaleComponent } from './sale/sale/sale.component';

let routes:Routes = [
  {path:"",component:ManageComponent},
  {path:"sale",component:SaleComponent},

]
@NgModule({
  declarations: [ManageComponent,SaleComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ManageModule { }
