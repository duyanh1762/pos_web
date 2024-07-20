import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Staff } from 'src/app/Models/staff';

@Injectable({
  providedIn: 'root'
})
export class LoadManageGuard implements CanLoad {
  constructor(private router:Router){}
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let staff:Staff = JSON.parse(localStorage.getItem("staff-infor") || '{}')
      if(staff.role === 'quan_ly'){
        return true;
      }
      this.router.navigate(["/tables"]);
      return false;
  }
}
