import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './Guard/AuthGuard/auth.guard';
import { LoginGuard } from './Guard/LoginGuard/login.guard';
import { ApiService } from './Service/api.service';
import { StaffLoginComponent } from './home/staff-login/staff-login/staff-login.component';
import { TablesComponent } from './tables/tables.component';
import { StaffGuard } from './Guard/StaffGuard/staff.guard';
import { OrderComponent } from './tables/order/order/order.component';
import { BillEditorComponent } from './tables/bill-editor/bill-editor/bill-editor.component';
import { InforComponent } from './tables/infor/infor.component';
import { HistoryComponent } from './tables/history/history.component';
import { LongClickDirective } from './Directives/long-click.directive';
import { ManageModule } from './manage/manage.module';
import { LoadManageGuard } from './Guard/LoadManage/load-manage.guard';
import { MoneyTransformPipe } from './Pipes/money-transform.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    StaffLoginComponent,
    TablesComponent,
    OrderComponent,
    BillEditorComponent,
    InforComponent,
    HistoryComponent,
    LongClickDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    ManageModule,
  ],
  providers: [AuthGuard,LoginGuard,ApiService,StaffGuard,LoadManageGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
