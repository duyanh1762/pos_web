import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { AuthGuard } from './core/Guard/AuthGuard/auth.guard';
import { LoginGuard } from './core/Guard/LoginGuard/login.guard';
import { TablesComponent } from './features/tables/tables.component';
import { StaffGuard } from './core/Guard/StaffGuard/staff.guard';
import { OrderComponent } from './features/tables/order/order/order.component';
import { LoadManageGuard } from './core/Guard/LoadManage/load-manage.guard';
import { BaristaComponent } from './features/barista/barista.component';
import { RoleGuard } from './core/Guard/RoleGuard/role.guard';
import { OrderGoodsComponent } from './features/goods/order-goods/order-goods.component';
import { BacklogGoodsComponent } from './features/goods/backlog-goods/backlog-goods.component';
import { GoodsComponent } from './features/goods/goods.component';

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
      import('./features/manage/manage.module').then((m) => m.ManageModule),
    canLoad: [LoadManageGuard],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
