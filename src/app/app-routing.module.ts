import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './Guard/AuthGuard/auth.guard';
import { LoginGuard } from './Guard/LoginGuard/login.guard';
import { TablesComponent } from './tables/tables.component';
import { StaffGuard } from './Guard/StaffGuard/staff.guard';
import { OrderComponent } from './tables/order/order/order.component';
import { LoadManageGuard } from './Guard/LoadManage/load-manage.guard';
import { BaristaComponent } from './barista/barista.component';
import { RoleGuard } from './Guard/RoleGuard/role.guard';
import { OrderGoodsComponent } from './goods/order-goods/order-goods.component';
import { BacklogGoodsComponent } from './goods/backlog-goods/backlog-goods.component';
import { GoodsComponent } from './goods/goods.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  {
    path: 'tables',
    component: TablesComponent,
    canActivate: [AuthGuard, StaffGuard, RoleGuard],
  },
  {
    path: 'tables/order/:table',
    component: OrderComponent,
    canActivate: [AuthGuard, StaffGuard, RoleGuard],
  },
  {
    path: 'barista',
    component: BaristaComponent,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path:"goods",
    component:GoodsComponent,
    canActivate:[AuthGuard,StaffGuard,RoleGuard]
  },
  {
    path:"goods/order",
    component:OrderGoodsComponent,
    canActivate:[AuthGuard,StaffGuard,RoleGuard]
  },
  {
    path:"goods/backlog",
    component:BacklogGoodsComponent,
    canActivate:[AuthGuard,StaffGuard,RoleGuard]
  },
  {
    path: 'manage',
    loadChildren: () =>
      import('./manage/manage.module').then((m) => m.ManageModule),
    canLoad: [LoadManageGuard],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
