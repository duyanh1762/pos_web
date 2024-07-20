import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './Guard/AuthGuard/auth.guard';
import { LoginGuard } from './Guard/LoginGuard/login.guard';
import { TablesComponent } from './tables/tables.component';
import { StaffGuard } from './Guard/StaffGuard/staff.guard';
import { OrderComponent } from './tables/order/order/order.component';
import { ManageComponent } from './manage/manage.component';
import { LoadManageGuard } from './Guard/LoadManage/load-manage.guard';

const routes: Routes = [
  {path:"",component:HomeComponent,canActivate:[AuthGuard]},
  {path:"login",component:LoginComponent,canActivate:[LoginGuard]},
  {path:"tables",component:TablesComponent,canActivate:[AuthGuard,StaffGuard]},
  {path:"tables/order/:table",component:OrderComponent,canActivate:[AuthGuard,StaffGuard]},
  {path:"manage",loadChildren: ()=>import("./manage/manage.module").then((m)=> m.ManageModule),canLoad:[LoadManageGuard]},
  {path:"**",redirectTo:"",pathMatch:"full"},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
