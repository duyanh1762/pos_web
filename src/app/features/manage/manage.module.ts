import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage.component';
import { RouterModule, Routes } from '@angular/router';


import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ReportStaffComponent } from './report/report/report-staff/report-staff/report-staff.component';
import { ReportBillComponent } from './report/report/report-bill/report-bill/report-bill.component';
import { DetailComponent } from './sale/sale/detail/detail.component';
import { IncomeComponent } from './income/income.component';
import { ReceiptFormComponent } from './income/receipt-form/receipt-form.component';
import { SpendFormComponent } from './income/spend-form/spend-form.component';
import { ProfitLossComponent } from './report/report/profit-loss/profit-loss.component';
import { DetailGoodsComponent } from './report/report/profit-loss/detail-goods/detail-goods.component';
import { MoneyTransformPipe } from 'src/app/shared/Pipes/money-transform.pipe';
import { SaleComponent } from './sale/sale/sale.component';
import { ReportComponent } from './report/report/report.component';

let routes:Routes = [
  {path:"",component:ManageComponent},
  {path:"sale",component:SaleComponent},
  {path:"report",component:ReportComponent},
  {path:"report/staff",component:ReportStaffComponent},
  {path:'report/bill',component:ReportBillComponent},
  {path:"report/profit",component:ProfitLossComponent},
  {path:"income",component:IncomeComponent}
]
@NgModule({
  declarations: [ManageComponent,SaleComponent,MoneyTransformPipe, ReportComponent, ReportStaffComponent, ReportBillComponent, DetailComponent, IncomeComponent, ReceiptFormComponent, SpendFormComponent, ProfitLossComponent, DetailGoodsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule
  ],
  providers:[],
  exports:[
    MoneyTransformPipe,
  ]
})
export class ManageModule { }
