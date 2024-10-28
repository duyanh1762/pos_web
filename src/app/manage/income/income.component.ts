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

  constructor(private api:ApiService , private bsMS: BsModalService) { }

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
}
