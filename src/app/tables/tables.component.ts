import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Shop } from '../Models/shop';
import { Staff } from '../Models/staff';
import { Bill } from '../Models/bill';
import { ApiService } from '../Service/api.service';
import { DataRequest } from '../Interface/data_request';
interface InforTable{
  table:string;
  bill:Bill | null;
}
@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {
  shop:Shop;
  staff:Staff;
  tables:Array<InforTable> = [];
  bills:Array<Bill> = [];
  constructor(private router:Router , private api:ApiService) { }

  ngOnInit(): void {
    this.load();
  }
  logout(){
    localStorage.removeItem("staff-infor");
    this.router.navigate(["/"]);
  }
  async load(){
    let request:DataRequest={
      mode:"get",
      data:"",
    };
    this.shop = JSON.parse(localStorage.getItem("shop-infor") || '{}');
    this.staff = JSON.parse(localStorage.getItem("staff-infor") || '{}');
    for(let i = 1 ;i<=this.shop.number_table;i++){
      let table:InforTable = {table:""+i,bill:null};
      this.tables.push(table);
    };
    await this.api.getBill(request).toPromise().then((response:any)=>{
      response.forEach((bill:Bill)=>{
        if(bill.status === "not_pay" && bill.shopID === this.shop.id){
          this.bills.push(bill);
        };
      });
    });
    this.tables.forEach((table:InforTable)=>{
      this.bills.forEach((bill:Bill)=>{
        if(bill.table === table.table){
          table.bill = bill;
        }
      });
    });

    console.log(this.tables);
  }
}
