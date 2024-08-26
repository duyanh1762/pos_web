import { Component, Input, OnInit } from '@angular/core';
import { BillDetail } from 'src/app/Models/bill_detail';
import { ApiService } from 'src/app/Service/api.service';
interface DetailInfor {
  id: number;
  itemID: number;
  num: number;
  billID: number;
  policyID: number;
  price: number;
  name: string;
  total: number;
}
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  @Input() data:number;
  listItem:Array<DetailInfor> = [];
  sum:number = 0;
  constructor(private api:ApiService) { }

  ngOnInit(): void {
    this.load();
  }
  async load(){
   await this.api.details({mode:"get",data:Number(this.data)}).toPromise().then((details:any)=>{
      details.forEach(async(d:BillDetail)=>{
        let n:string = "";
        let p:number = 0;
        await this.api.getNameItem(d.itemID).then((res:any)=>{
          n = res;
        });
        await this.api.getPriceItem(d.itemID).then((res:any)=>{
          p = res;
        });
        let di:DetailInfor = {
          ...d,
          name:n,
          price:p,
          total: d.num * p
        };
        this.listItem.push(di);
        this.sum = this.sum + di.total;
      });
    });
  }
}
