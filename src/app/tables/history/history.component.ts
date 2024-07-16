import { Component, Input, OnInit } from '@angular/core';
import { table } from 'console';
import { filter, map } from 'rxjs';
import { Bill } from 'src/app/Models/bill';
import { BillDetail } from 'src/app/Models/bill_detail';
import { Item } from 'src/app/Models/item';
import { Shop } from 'src/app/Models/shop';
import { Staff } from 'src/app/Models/staff';
import { ApiService } from 'src/app/Service/api.service';
interface BillInfor{
  id:string | null,
  total:number,
  time:string,
  staff:string,
}
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  @Input() data:any;
  shop:Shop;
  bills:Array<BillInfor> = [];
  items:Array<Item> = [];
  constructor(private api:ApiService) { }

  ngOnInit(): void {
    this.load();
  }

 async load(){
    let request = {
      mode:"get",
      data:"",
    };
    await this.api.getItems(request).toPromise().then((res:any)=>{
      this.items = res;
    });
    this.shop = JSON.parse(localStorage.getItem("shop-infor") || '{}');
    this.api.getBill(request).subscribe((res:any)=>{
      res.forEach(async (item:Bill)=>{
        if(item.table === this.data.table && item.shopID === this.shop.id && this.api.getCurrentDate() === this.api.getBillDate(item) && item.status === "pay"){
          let money = 0;
          let name = "";
          let date = new Date(item.date);
          await this.api.getStaff(request).toPromise().then((res:any)=>{
            res.forEach((i:Staff)=>{
              if(i.id === item.staffID){
                name = i.name;
              }
            });
          });
          await this.api.getDetail({mode:"get",data:Number(item.id)}).toPromise().then((res:any)=>{
            res.forEach((b:BillDetail)=>{
              this.items.forEach((i:Item)=>{
                if(i.id === b.itemID){
                  money = money + b.num * i.price;
                }
              });
            });
          });
          let billInfor:BillInfor={
            id:item.id.toString(),
            time:date.toString(),
            staff:name,
            total:money,
          };
          console.log(billInfor);
          this.bills.push(billInfor);
        }
      });
    });
  }

}
