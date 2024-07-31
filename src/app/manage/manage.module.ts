import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage.component';
import { RouterModule, Routes } from '@angular/router';
import { SaleComponent } from './sale/sale/sale.component';
import { MoneyTransformPipe } from '../Pipes/money-transform.pipe';
import { ReportComponent } from './report/report/report.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ReportStaffComponent } from './report/report/report-staff/report-staff/report-staff.component';
import { ReportBillComponent } from './report/report/report-bill/report-bill/report-bill.component';

let routes:Routes = [
  {path:"",component:ManageComponent},
  {path:"sale",component:SaleComponent},
  {path:"report",component:ReportComponent},
  {path:"report/staff",component:ReportStaffComponent},
  {path:'report/bill',component:ReportBillComponent},
]
@NgModule({
  declarations: [ManageComponent,SaleComponent,MoneyTransformPipe, ReportComponent, ReportStaffComponent, ReportBillComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule
  ],
  exports:[
    MoneyTransformPipe,
  ]
})
export class ManageModule { }
