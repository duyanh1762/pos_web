import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/core/Service/api.service';
import { Goods } from 'src/app/shared/Models/goods';
import { IeBill } from 'src/app/shared/Models/ie_bill';
import { IeDetail } from 'src/app/shared/Models/ie_detail';
import { Shop } from 'src/app/shared/Models/shop';
import { Staff } from 'src/app/shared/Models/staff';
import { ReceiptFormComponent } from '../../manage/income/receipt-form/receipt-form.component';


interface IeInfor {
  id: number;
  createAt: string;
  confirmAt: string;
  staffID: number;
  shopID: number;
  status: string;
  type: string; // import || export
  total: number;
}

@Component({
  selector: 'app-backlog-goods',
  templateUrl: './backlog-goods.component.html',
  styleUrls: ['./backlog-goods.component.css']
})
export class BacklogGoodsComponent implements OnInit {
  goodsValue:number = 0;
  ieBills:Array<IeInfor> = [];
  goods:Array<Goods> = [];
  staffs:Array<Staff> = [];
  shop:Shop;

  constructor(private api:ApiService , private bsService:BsModalService) { }

  ngOnInit(): void {
    this.load();
  }
  async load(){
    this.shop = JSON.parse(localStorage.getItem('shop-infor') || '{}');
    await this.api.goods({mode:"get",data:""}).toPromise().then((res:any)=>{
      this.goods = res;
    });
    await this.api.staff({mode:"get",data:""}).toPromise().then((res:any)=>{
      this.staffs = res;
    });
    await this.api.ieBill({mode:"get-by-shop",data:this.shop.id}).toPromise().then(async (res:any)=>{
      let ie:IeBill;
      for(ie of res){
        if(ie.status === "not_confirm" && ie.type === "export"){
          let total:number = 0;
          await this.api.ieDetail({mode:"get",data:ie.id}).toPromise().then((res:any)=>{
            res.forEach((ied:IeDetail)=>{
              this.goods.forEach((g:Goods)=>{
                if(ied.itemID === g.id){
                  total = total + ied.num * g.price;
                }
              });
            });
          });
          ie.createAt = this.api.dateTransform(ie.createAt);
          this.ieBills.push({...ie,total:total});
          this.goodsValue = this.goodsValue + total;
        }
      }
    });
  }
  showDetail(id:number){
        let userCreate: string = '';
        let date:string = "";
        let ieB = this.ieBills.find((ie: IeInfor) => {
          return ie.id === id;
        });
        this.ieBills.forEach((ie:IeInfor)=>{
          if(ie.id === id){
            date = ie.createAt.split(" ")[0];
          }
        });
        this.staffs.forEach((s: Staff) => {
          if (ieB?.staffID === s.id) {
            userCreate = s.name;
          }
        });
        this.bsService.show(ReceiptFormComponent, {
          initialState: {
            data: {
              goods: this.goods,
              id: id,
              date: date,
              staff: userCreate,
            },
          },
        });
  }
}
