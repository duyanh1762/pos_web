import { Component, OnInit } from '@angular/core';
import { Bill } from 'src/app/Models/bill';
import { Item } from 'src/app/Models/item';
import { Shop } from 'src/app/Models/shop';
import { Staff } from 'src/app/Models/staff';
import { ApiService } from 'src/app/Service/api.service';
interface SatffInfor{
  id: number;
  shopID:number
  name: string;
  status: string;
  total:number;
}
@Component({
  selector: 'app-report-staff',
  templateUrl: './report-staff.component.html',
  styleUrls: ['./report-staff.component.css']
})
export class ReportStaffComponent implements OnInit {
  startDate: Date | null = null;
  endDate: Date | null = null;
  items:Array<Item> = [];
  staffs:Array<SatffInfor> =[];
  shop:Shop;
  bills:Array<Bill>= [];
  constructor(private api:ApiService) { }

  ngOnInit(): void {
    this.load();
  }
  async load(){
    this.shop = JSON.parse(localStorage.getItem('shop-infor') || '{}');
    let request = {
      mode:"get",
      data:"",
    };
    await this.api.getItems(request).toPromise().then((res:any)=>{this.items = res});
    await this.api.getBill(request).toPromise().then((res:any)=>{this.bills = res});
    await this.api.getStaff(request).toPromise().then((res:any)=>{
      res.forEach((s:Staff)=>{
        if(this.shop.id === s.shopID){
          let si = {
            id: s.id,
            shopID:s.shopID,
            name: s.name,
            status: s.status,
            total:0,
          }
          this.staffs.push(si);
        }
      });
    });
    console.log(this.staffs);
  }
  confirmDate(){
    let count = 0;
    console.log(this.bills);
    this.bills.forEach((b:Bill)=>{
      let billDate = new Date(b.date);
      if( this.endDate != null){
        if( billDate <= this.endDate){
          count = count + 1;
          console.log(b);
          console.log(billDate);
          console.log(this.endDate);
        }
      }
    });
    console.log(count);
  }
}
