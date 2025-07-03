import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ManageModule } from './features/manage/manage.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { StaffLoginComponent } from './features/home/staff-login/staff-login/staff-login.component';
import { TablesComponent } from './features/tables/tables.component';
import { OrderComponent } from './features/tables/order/order/order.component';
import { BillEditorComponent } from './features/tables/bill-editor/bill-editor/bill-editor.component';
import { InforComponent } from './features/tables/infor/infor.component';
import { HistoryComponent } from './features/tables/history/history.component';
import { LongClickDirective } from './shared/Directives/long-click.directive';
import { BaristaComponent } from './features/barista/barista.component';
import { PurchaseInforComponent } from './features/tables/purchase-infor/purchase-infor.component';
import { NoteEditComponent } from './features/tables/order/note-edit/note-edit.component';
import { OrderGoodsComponent } from './features/goods/order-goods/order-goods.component';
import { GoodsComponent } from './features/goods/goods.component';
import { BacklogGoodsComponent } from './features/goods/backlog-goods/backlog-goods.component';
import { AuthGuard } from './core/Guard/AuthGuard/auth.guard';
import { LoginGuard } from './core/Guard/LoginGuard/login.guard';
import { ApiService } from './core/Service/api.service';
import { StaffGuard } from './core/Guard/StaffGuard/staff.guard';
import { LoadManageGuard } from './core/Guard/LoadManage/load-manage.guard';
import { RoleGuard } from './core/Guard/RoleGuard/role.guard';
import { AuthInterceptor } from './core/Interceptor/auth.interceptor';

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
  providers: [AuthGuard,LoginGuard,ApiService,StaffGuard,LoadManageGuard,RoleGuard,{provide:HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
