import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/core/Service/api.service';
import { Bill } from 'src/app/shared/Models/bill';
import { BillDetail } from 'src/app/shared/Models/bill_detail';
import { Item } from 'src/app/shared/Models/item';
import { Staff } from 'src/app/shared/Models/staff';

@Component({
  selector: 'app-infor',
  templateUrl: './infor.component.html',
  styleUrls: ['./infor.component.css'],
})
export class InforComponent implements OnInit {
  @Input() data: any;
  public revenue: number = 0;
  public staff:Staff;
  constructor(private api: ApiService,private bsModalRef:BsModalRef,private router:Router) {}

  ngOnInit(): void {
    this.load();
  }
  async load() {
    this.staff = JSON.parse(localStorage.getItem("staff-infor") || '{}');
    let request = {
      mode: 'get',
      data: '',
    };
    let bills: Array<Bill> = [];
    let items :Array<Item> = [];
    await this.api.item({mode:"get",data:""}).toPromise().then((res:any)=>{
      items = res;
    });
    await this.api
      .bill(request)
      .toPromise()
      .then((response: any) => {
        bills = response;
        bills.forEach(async(bill:Bill)=>{
          if(this.api.billDate(bill) === this.api.getCurrentDate() && bill.shopID === this.data.shop.id && bill.staffID === this.data.staff.id && bill.status === "pay"){
            await this.api.details({mode:"get",data:Number(bill.id)}).toPromise().then((res:any)=>{
              res.forEach((d:BillDetail)=>{
                items.forEach((i:Item)=>{
                  if(d.itemID === i.id){
                    this.revenue = this.revenue + d.num*i.price;
                  }
                });
              });
            });
          }
        });
      });
  }
  navigate(){
    this.router.navigate(["/manage"]);
    this.bsModalRef.hide();
  }
}
