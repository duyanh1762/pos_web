import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../Service/api.service';
import { DataRequest } from '../Interface/data_request';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { StaffLoginComponent } from './staff-login/staff-login/staff-login.component';

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
    this.router.navigate(["/login"]);
  }

  public load(){
    let shop  = JSON.parse(localStorage.getItem("shop-infor") || '{}');
    let request:DataRequest = {
      mode:"get",
      data:"",
    }
    this.api.getStaff(request).subscribe((response:any)=>{
      response.forEach((staff:any)=>{
        if(staff.shopID == shop.id){
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
