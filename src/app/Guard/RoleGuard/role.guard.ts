import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Staff } from 'src/app/Models/staff';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let staff:Staff = JSON.parse(localStorage.getItem("staff-infor") || "{}");
    if(staff.role === "thu_ngan" || staff.role === "quan_ly"){
      return true;
    }
    this.router.navigate(["/"]);
    return false;
  }

}
