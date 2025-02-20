import { Component, OnInit } from '@angular/core';
import { ApiService } from '../Service/api.service';
import { LoginReQuest } from '../Interface/login_request';
import { Router } from '@angular/router';
import { LoginResponse } from '../Interface/login_response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public shopName:string = "";
  public password:string = "";

  constructor(private api:ApiService,private router:Router) {
    this.api.nav_open = false;
   }

  ngOnInit(): void {
  }

  public onSubmit(){
    let request:LoginReQuest={
      username: this.shopName,
      password:this.password,
      authType:"SHOP_AUTH",
    }
    this.api.login(request).subscribe((response:any)=>{
      if(response.success === true){
        localStorage.setItem("login-status","true");
        localStorage.setItem("shop-infor",JSON.stringify(response.data));
        this.router.navigate(["/"]);
      }else{
        localStorage.removeItem("login-status");
        alert("Thong tin dang nhap khong hop le !");
      }
    });
  }
}
