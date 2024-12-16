import { Component, OnInit } from '@angular/core';
import { DateRange } from '@angular/material/datepicker';
import { DataRequest } from 'src/app/Interface/data_request';
import { Bill } from 'src/app/Models/bill';
import { BillDetail } from 'src/app/Models/bill_detail';
import { Item } from 'src/app/Models/item';
import { Shop } from 'src/app/Models/shop';
import { Spend } from 'src/app/Models/spend';
import { Staff } from 'src/app/Models/staff';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.css']
})
export class ProfitLossComponent implements OnInit {
  startDate:Date | null = null;
  endDate:Date | null = null;
  shop:Shop;
  staff:Staff;
  revenue:number = 0;
  spend:number = 0;
  listSpend:Array<Spend> = [];
  items:Array<Item> = [];
  export:boolean = false;

  constructor(private api:ApiService) { }

  ngOnInit(): void {
    this.load();
  }
  async load(){
    let request:DataRequest = {
      mode:"get",
      data:""
    };
    await this.api.item(request).toPromise().then((res:any)=>{
      this.items = res;
    });
    this.shop = JSON.parse(localStorage.getItem("shop-infor") || "{}");
    this.staff = JSON.parse(localStorage.getItem("staff-infor") || "{}");
  }
  onStartDateChange(event: any): void {
    if (event) {
      this.startDate = new Date(event);
      this.startDate.setHours(0, 0, 0, 0);
    }
  }

  onEndDateChange(event: any): void {
    if (event) {
      this.endDate = new Date(event);
      this.endDate.setHours(23, 59, 59, 999);
    }
  }

  async confirmdDate(){
    this.spend = 0;
    this.revenue = 0;
    this.listSpend = [];
    if(this.startDate != null && this.endDate != null){
      let request:DataRequest = {
        mode:"get",
        data:""
      };
     await this.api.bill(request).toPromise().then(async (resB:any)=>{
        for(let b of resB ){
          let bDate = new Date(b.date);
          if(b.status === "pay" && b.shopID === this.shop.id && bDate >= this.startDate! && bDate <= this.endDate!){
           await this.api.details({mode:"get",data:Number(b.id)}).toPromise().then((resD:any)=>{
              resD.forEach((d:BillDetail)=>{
                this.items.forEach((i:Item)=>{
                  if(d.itemID === i.id){
                    this.revenue = this.revenue + (d.num * i.price);
                  }
                });
              });
            });
          }
        };
      });
     await this.api.spend(request).toPromise().then((resS:any)=>{
        resS.forEach((s:Spend)=>{
          let sDate = new Date(s.date);
          if(s.shopID === this.shop.id && s.status === "Active" && sDate >= this.startDate! && sDate <= this.endDate!){
            this.spend = this.spend + s.total;
            s.date = this.api.dateTransform(s.date);
            this.listSpend.push(s);
          }
        });
      });
      if(this.listSpend.length > 0){
        this.export = true;
      }
    }else{
      alert("Hãy chọn khoảng thời gian bạn muốn xem báo cáo !")
    }
  }
  exporSpendtReport(){
    let start:string = this.api.dateTransform(this.startDate?.toString() || " ").split(" ")[0];
    let end:string = this.api.dateTransform(this.endDate?.toString() || " ").split(" ")[0];
    let nameFile : string  = "bao_cao_danh_muc_chi_"+start+"_"+end;
    let exportSpend:Array<any> = this.listSpend.map((sp:Spend)=>{
      return {
        "Mã danh mục":sp.id,
        "Ngày":sp.date.split(" ")[0],
        "Thời gian":sp.date.split(" ")[1],
        "Cửa hàng":this.shop.address,
        "Mô tả":sp.des,
        "Chi phí":sp.total.toString() + "đ",
      }
    });
    this.api.exportExcel(nameFile,exportSpend,"data");
  }
}
