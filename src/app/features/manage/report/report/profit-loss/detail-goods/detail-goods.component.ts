import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/Service/api.service';
import { Goods } from 'src/app/shared/Models/goods';
import { IeDetail } from 'src/app/shared/Models/ie_detail';

interface GoodsInfor{
  id:number;
  name:string
  unit:string;
  groupID:number;
  price:number;
  remaining:number,
  num:number,
}

@Component({
  selector: 'app-detail-goods',
  templateUrl: './detail-goods.component.html',
  styleUrls: ['./detail-goods.component.css']
})
export class DetailGoodsComponent implements OnInit {
  @Input() data:any;

  goods:Array<GoodsInfor> = [];

  constructor(private api:ApiService) { }

  ngOnInit(): void {
    this.load();
  }
  async load(){
    let ieBills:Array<any>  = this.data.ieBills;
    for(let ie of ieBills){
      await this.api.ieDetail({mode:"get",data:ie.id}).toPromise().then((res:any)=>{
        res.forEach((ied:IeDetail)=>{
          let isExits:boolean = false;
          this.goods.forEach((g:GoodsInfor)=>{
            if(g.id === ied.itemID){
              g.num = g.num + ied.num;
              isExits = true;
            }
          });
          if(isExits === false){
            this.data.goods.forEach((g:Goods)=>{
              if(ied.itemID === g.id){
                this.goods.push({...g,num:ied.num});
              }
            });
          }
        });
      });
    }
  }
}
