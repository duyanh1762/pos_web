import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/Service/api.service';
import { IeDetail } from 'src/app/shared/Models/ie_detail';

interface IeDetailInfor {
  id: number;
  itemID: number;
  num: number;
  ieID: number;
  note: string;
  price: number;
  name: string;
  unit: string;
}

@Component({
  selector: 'app-receipt-form',
  templateUrl: './receipt-form.component.html',
  styleUrls: ['./receipt-form.component.css']
})
export class ReceiptFormComponent implements OnInit {
  @Input() data:any;

  listDetail:Array<IeDetailInfor> = [];
  sum:number = 0;

  constructor(private api:ApiService) { }

  ngOnInit(): void {
    this.load();
  }

  async load(){
    await this.api.ieDetail({mode:"get",data:this.data.id}).toPromise().then((res:any)=>{
      res.forEach((ied:IeDetail)=>{
        let ieDetail:IeDetailInfor = {
          ...ied,
          name: this.api.getNameGoods(ied.itemID,this.data.goods),
          price: this.api.getPriceGoods(ied.itemID,this.data.goods),
          unit: this.api.getUnitGoods(ied.itemID,this.data.goods),
        };
        this.listDetail.push(ieDetail);
      });
    });
    this.listDetail.forEach((ied:IeDetailInfor)=>{
      this.sum = this.sum + ied.num *ied.price
    });
  }
}
