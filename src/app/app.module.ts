import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ManageModule } from './manage/manage.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { StaffLoginComponent } from './home/staff-login/staff-login/staff-login.component';
import { TablesComponent } from './tables/tables.component';
import { OrderComponent } from './tables/order/order/order.component';
import { BillEditorComponent } from './tables/bill-editor/bill-editor/bill-editor.component';
import { InforComponent } from './tables/infor/infor.component';
import { HistoryComponent } from './tables/history/history.component';
import { BaristaComponent } from './barista/barista.component';
import { PurchaseInforComponent } from './tables/purchase-infor/purchase-infor.component';
import { NoteEditComponent } from './tables/order/note-edit/note-edit.component';
import { OrderGoodsComponent } from './goods/order-goods/order-goods.component';
import { GoodsComponent } from './goods/goods.component';
import { BacklogGoodsComponent } from './goods/backlog-goods/backlog-goods.component';

import { AuthGuard } from './Guard/AuthGuard/auth.guard';
import { LoginGuard } from './Guard/LoginGuard/login.guard';
import { StaffGuard } from './Guard/StaffGuard/staff.guard';
import { LoadManageGuard } from './Guard/LoadManage/load-manage.guard';
import { RoleGuard } from './Guard/RoleGuard/role.guard';

import { ApiService } from './Service/api.service';

import { LongClickDirective } from './Directives/long-click.directive';

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
    BaristaComponent,
    PurchaseInforComponent,
    NoteEditComponent,
    OrderGoodsComponent,
    GoodsComponent,
    BacklogGoodsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    ManageModule,
    BrowserAnimationsModule,
    FormsModule,
  ],
  providers: [AuthGuard,LoginGuard,ApiService,StaffGuard,LoadManageGuard,RoleGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
