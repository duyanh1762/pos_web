import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DataRequest } from 'src/app/Interface/data_request';
import { Staff } from 'src/app/Models/staff';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-staff-login',
  templateUrl: './staff-login.component.html',
  styleUrls: ['./staff-login.component.css'],
})
export class StaffLoginComponent implements OnInit {
  @Input() data: number;
  password: string = '';
  constructor(private api: ApiService,private router:Router , private bsModelRef: BsModalRef) {}

  ngOnInit(): void {}

  async handlerPassword() {
    let request: DataRequest = {
      mode: 'get',
      data: '',
    };
    let staffG: Staff = {
      id: 0,
      shopID: 0,
      name: '',
      password: '',
      role: '',
      status: '',
    };
    await this.api
      .staff(request)
      .toPromise()
      .then((data: any) => {
        data.forEach((staff: Staff) => {
          if (this.data === staff.id) {
            staffG = staff;
          }
        });
      });
    if (this.password === staffG.password) {
      this.bsModelRef.hide();
      localStorage.setItem("staff-infor",JSON.stringify(staffG));
      this.api.role = staffG.role;
      if(staffG.role === "thu_ngan" || staffG.role === "quan_ly"){
        this.router.navigate(["/tables"]);
      }else{
        this.router.navigate(["/barista"]);
      }
    } else {
      localStorage.removeItem("staff-infor");
      alert('Sai mat khau !');
    }
  }
}
