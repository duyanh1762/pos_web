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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    StaffLoginComponent,
    TablesComponent,
    OrderComponent,
    BillEditorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
  ],
  providers: [AuthGuard,LoginGuard,ApiService,StaffGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
