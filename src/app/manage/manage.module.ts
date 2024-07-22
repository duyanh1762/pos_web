import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage.component';
import { RouterModule, Routes } from '@angular/router';
import { SaleComponent } from './sale/sale/sale.component';
import { MoneyTransformPipe } from '../Pipes/money-transform.pipe';

let routes:Routes = [
  {path:"",component:ManageComponent},
  {path:"sale",component:SaleComponent},

]
@NgModule({
  declarations: [ManageComponent,SaleComponent,MoneyTransformPipe],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports:[
    MoneyTransformPipe,
  ]
})
export class ManageModule { }
