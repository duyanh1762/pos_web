import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './Guard/AuthGuard/auth.guard';
import { LoginGuard } from './Guard/LoginGuard/login.guard';
import { TablesComponent } from './tables/tables.component';
import { StaffGuard } from './Guard/StaffGuard/staff.guard';

const routes: Routes = [
  {path:"",component:HomeComponent,canActivate:[AuthGuard]},
  {path:"login",component:LoginComponent,canActivate:[LoginGuard]},
  {path:"tables",component:TablesComponent,canActivate:[AuthGuard,StaffGuard]},
  {path:"**",redirectTo:"",pathMatch:"full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
