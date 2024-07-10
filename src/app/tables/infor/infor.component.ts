import { Component, Input, OnInit } from '@angular/core';
import { Bill } from 'src/app/Models/bill';
import { BillDetail } from 'src/app/Models/bill_detail';
import { Item } from 'src/app/Models/item';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-infor',
  templateUrl: './infor.component.html',
  styleUrls: ['./infor.component.css'],
})
export class InforComponent implements OnInit {
  @Input() data: any;
  public revenue: number = 0;
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }
  async load() {
    let request = {
      mode: 'get',
      data: '',
    };
    let bills: Array<Bill> = [];
    let items :Array<Item> = [];
    await this.api.getItems({mode:"get",data:""}).toPromise().then((res:any)=>{
      items = res;
    });
    await this.api
      .getBill(request)
      .toPromise()
      .then((response: any) => {
        bills = response;
        bills.forEach(async(bill:Bill)=>{
          if(this.api.getBillDate(bill) === this.api.getCurrentDate() && bill.shopID === this.data.shop.id && bill.staffID === this.data.staff.id && bill.status === "pay"){
            await this.api.getDetail({mode:"get",data:Number(bill.id)}).toPromise().then((res:any)=>{
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
}
