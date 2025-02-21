import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/Service/api.service';
import { SpendFormComponent } from './spend-form/spend-form.component';
import { Shop } from 'src/app/Models/shop';
import { Staff } from 'src/app/Models/staff';
import { Spend } from 'src/app/Models/spend';
import { Bill } from 'src/app/Models/bill';
import { Item } from 'src/app/Models/item';
import { BillDetail } from 'src/app/Models/bill_detail';
import { DataRequest } from 'src/app/Interface/data_request';
import { Goods } from 'src/app/Models/goods';
import { IeBill } from 'src/app/Models/ie_bill';
import { IeDetail } from 'src/app/Models/ie_detail';
import { toArray } from 'rxjs';
import { ReceiptFormComponent } from './receipt-form/receipt-form.component';
import { Router } from '@angular/router';

interface IeInfor {
  id: number;
  createAt:string;
  confirmAt:string;
  staffID: number;
  shopID:number;
  status:string;
  type:string; // import || export
  total:number;
}

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css']
})
export class IncomeComponent implements OnInit {
  shop:Shop;
  staff:Staff;
  revenue:number = 0;
  spend:number = 0;
  listSpend:Array<Spend> = [];
  items:Array<Item> = [];
  ieBills:Array<IeInfor> = [];
  goodsValue:number = 0;
  goods:Array<Goods> =[]
  staffs:Array<Staff> = [];


  constructor(private api:ApiService , private bsMS: BsModalService,private router:Router) { }

  ngOnInit(): void {
    this.load();
  }

  async load(){
    this.shop = JSON.parse(localStorage.getItem("shop-infor") || "{}");
    this.staff = JSON.parse(localStorage.getItem("staff-infor") || "{}");
    let request:any = {
      mode:"get",
      data:""
    };
    await this.api.item(request).toPromise().then((res:any)=>{
      this.items = res;
    });
    await this.api.staff(request).toPromise().then((res:any)=>{
      this.staffs = res;
    });
    await this.api.goods(request).toPromise().then((res:any)=>{
      this.goods = res;
    });
    await this.api.spend(request).toPromise().then((res:any)=>{
      res.forEach((s:Spend)=>{
        s.date = this.api.dateTransform(s.date);
        if(s.date.split(" ")[0] === this.getDate() && s.status === "Active" && s.shopID === this.shop.id){
          this.listSpend.push(s);
          this.spend = this.spend + s.total;
        }
      });
    });
    await this.api.bill(request).toPromise().then(async(res:any)=>{
      for (let b of res){
        b.date = this.api.dateTransform(b.date);
        if(b.date.split(" ")[0] === this.getDate() && b.status === "pay" && b.shopID === this.shop.id){
          await this.api.details({mode:"get",data:Number(b.id)}).toPromise().then((response:any)=>{
             response.forEach((d:BillDetail)=>{
              this.items.forEach((i:Item)=>{
                if(d.itemID === i.id){
                  this.revenue = this.revenue + (d.num * i.price);
                }
              })
             });
          });
        }
      }
    });
    await this.api.ieBill({mode:"get-by-shop",data:this.shop.id}).toPromise().then(async (res:any)=>{
      let ie:IeBill;
      for(ie of res){
        let ieDate:string = this.api.ieDate(ie);
        if (
          ieDate === this.api.getCurrentDate() &&
          ie.shopID === this.shop.id &&
          ie.type === 'export' &&
          ie.status != "delete"
        ){
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
          ie.createAt = this.api.dateTransform(ie.createAt).split(" ")[1];
          this.ieBills.push({...ie,total});
          this.goodsValue = this.goodsValue + total;
          console.log(this.ieBills)
        }
      }
    });
  }

  openSpendForm(){
    this.bsMS.show(SpendFormComponent,{
      initialState:{
        data:{
          shopID:this.shop.id,
          staffID:this.staff.id,
          type:"create",
        }
      }
    }).content?.response.subscribe((res:Spend)=>{
      this.listSpend.push(res);
      this.spend = this.spend + res.total;
    });
  }
  editSpendForm(s:Spend){
    this.bsMS.show(SpendFormComponent,{
      initialState:{
        data:{
          data:s,
          type:"edit"
        }
      }
    }).content?.response.subscribe((res:Spend)=>{
      this.listSpend.forEach((s:Spend)=>{
        if(s.id === res.id){
          this.spend  = this.spend - s.total;
          this.spend = this.spend + res.total;
          s.des = res.des;
          s.total = res.total;
        }
      });
    });
  }
  deleteSpend(s:Spend){
    if(confirm("Bạn chắc chắn muốn xoá phiếu này ?")){
      s.status = "Not_Active";
      s.date = s.date.split(" ")[0].split("-")[2] + "-" + s.date.split(" ")[0].split("-")[1] + "-" + s.date.split(" ")[0].split("-")[0] + " " + s.date.split(" ")[1];
      let request:DataRequest = {
        mode:"update",
        data:s
      };
      this.api.spend(request).subscribe((res:any)=>{
        if(res.affected === 1){
          alert("Xoá thành công !");
          for(let i = 0;i<this.listSpend.length;i++){
            if(this.listSpend[i].id === s.id){
              this.listSpend.splice(i,1);
              this.spend = this.spend - s.total;
            }else{
              continue;
            }
          }
        }else{
          alert("Đã có lỗi xảy ra , xoá thất bại!");
        }
      });
    }
  }
  public getDate():string{
    let dateArr = this.api.getCurrentDate().split("-");
    return dateArr[2]+"-"+dateArr[1]+"-"+dateArr[0];
  }
  showDetail(id:number){
    let userCreate:string = "";
    let ieB = this.ieBills.find((ie:IeInfor)=>{
      return ie.id === id;
    });
    this.staffs.forEach((s:Staff)=>{
      if(ieB?.staffID === s.id){
        userCreate = s.name;
      }
    });
    this.bsMS.show(ReceiptFormComponent,{
      initialState:{
        data:{
          goods:this.goods,
          id:id,
          date:this.getDate(),
          staff:userCreate
        }
      }
    });
  }
  updateGoodsOrder(ie:IeInfor){
    if(ie.status != "not_confirm"){
      alert("Hoá đơn đã xác nhận , không thể chỉnh sửa !");
    }else{
      this.router.navigate(["/goods"]);
    }
  }
}
