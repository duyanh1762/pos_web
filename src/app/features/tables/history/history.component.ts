import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/Service/api.service';
import { Bill } from 'src/app/shared/Models/bill';
import { BillDetail } from 'src/app/shared/Models/bill_detail';
import { Item } from 'src/app/shared/Models/item';
import { Shop } from 'src/app/shared/Models/shop';
import { Staff } from 'src/app/shared/Models/staff';

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
    await this.api.item(request).toPromise().then((res:any)=>{
      this.items = res;
    });
    this.shop = JSON.parse(localStorage.getItem("shop-infor") || '{}');
    this.api.bill(request).subscribe((res:any)=>{
      res.forEach(async (item:Bill)=>{
        if(item.table === this.data.table && item.shopID === this.shop.id && this.api.getCurrentDate() === this.api.billDate(item) && item.status === "pay"){
          let money = 0;
          let name = "";
          let date = new Date(item.date);
          await this.api.staff(request).toPromise().then((res:any)=>{
            res.forEach((i:Staff)=>{
              if(i.id === item.staffID){
                name = i.name;
              }
            });
          });
          await this.api.details({mode:"get",data:Number(item.id)}).toPromise().then((res:any)=>{
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
            time:this.api.dateTransform(date.toString()).split(" ")[1],
            staff:name,
            total:money,
          };
          this.bills.push(billInfor);
        }
      });
    });
  }

}
