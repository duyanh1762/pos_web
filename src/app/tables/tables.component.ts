import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Shop } from '../Models/shop';
import { Staff } from '../Models/staff';
import { Bill } from '../Models/bill';
import { ApiService } from '../Service/api.service';
import { DataRequest } from '../Interface/data_request';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BillEditorComponent } from './bill-editor/bill-editor/bill-editor.component';
interface TableInfor{
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
  tables:Array<TableInfor> = [];
  bills:Array<Bill> = [];
  constructor(private router:Router , private api:ApiService,private bsModal:BsModalService) { }

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
      let table:TableInfor = {table:""+i,bill:null};
      this.tables.push(table);
    };
    await this.api.getBill(request).toPromise().then((response:any)=>{
      response.forEach((bill:Bill)=>{
        if(bill.status === "not_pay" && bill.shopID === this.shop.id && this.api.getBillDate(bill) === this.api.getCurrentDate()){
          this.bills.push(bill);
        };
      });
    });
    this.tables.forEach((table:TableInfor)=>{
      this.bills.forEach((bill:Bill)=>{
        if(bill.table === table.table){
          table.bill = bill;
        }
      });
    });
  }

  openEditor(table: TableInfor){
    if(table.bill === null){
      this.router.navigate(["/tables/order/"+table.table]);
    }else{
      this.bsModal.show(BillEditorComponent,{
        initialState:{
          data:table.bill,
        }
      }).content?.closed.subscribe((data)=>{
        if(data.status === "delete"){
          this.tables.forEach((t:TableInfor)=>{
            if(t.table === data.table){
              t.bill = null;
            }
          });
        }
      });
    }
  }
}
