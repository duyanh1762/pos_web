import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../Service/api.service';
import { DataRequest } from '../Interface/data_request';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { StaffLoginComponent } from './staff-login/staff-login/staff-login.component';
import { Staff } from '../Models/staff';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public staffs:Array<any> = [];
  constructor(private router:Router , private api:ApiService,private bsService: BsModalService) {
  }

  ngOnInit(): void {
    // console.log(JSON.parse(localStorage.getItem("shop-infor") || '{}'));
    this.load();
  }

  public logout(){
    localStorage.removeItem("login-status");
    localStorage.removeItem("shop-infor");
    localStorage.removeItem("staff-infor");
    localStorage.removeItem("order_item");
    this.router.navigate(["/login"]);
  }

  public load(){
    let shop  = JSON.parse(localStorage.getItem("shop-infor") || '{}');
    let request:DataRequest = {
      mode:"get",
      data:"",
    }
    this.api.staff(request).subscribe((response:any)=>{
      response.forEach((staff:Staff)=>{
        if(staff.shopID == shop.id && staff.status === "Active"){
          this.staffs.push(staff);
        }
      });
    });
  }
 public openModalPassword(id:number){
  this.bsService.show(StaffLoginComponent,{
    initialState:{
      data:id,
    }
  });
 }
}
