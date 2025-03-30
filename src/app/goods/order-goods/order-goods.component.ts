import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { ApiService } from '../Service/api.service';
import { Router } from '@angular/router';
import { DataRequest } from 'src/app/Interface/data_request';
import { Goods } from 'src/app/Models/goods';
import { Group } from 'src/app/Models/group';
import { IeBill } from 'src/app/Models/ie_bill';
import { IeDetail } from 'src/app/Models/ie_detail';
import { Shop } from 'src/app/Models/shop';
import { Staff } from 'src/app/Models/staff';
import { ApiService } from 'src/app/Service/api.service';

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

interface GoodsInfor {
  id: number;
  name: string;
  unit: string;
  groupID: number;
  price: number;
  remaining: number;
  isChoose: boolean;
}
@Component({
  selector: 'app-order-goods',
  templateUrl: './order-goods.component.html',
  styleUrls: ['./order-goods.component.css'],
})
export class OrderGoodsComponent implements OnInit {
  @ViewChild("searchInput",{read:ElementRef,static:true}) searchInput:ElementRef;
  @ViewChild("groupSelect",{read:ElementRef,static:true}) groupSelect:ElementRef;

  date: String;
  shop: Shop;
  staff: Staff;
  goods: Array<GoodsInfor> = [];
  goodsLU: Array<GoodsInfor> = [];
  cart: Array<IeDetailInfor> = [];
  total: number = 0;
  type: string = 'create'; //edit || create
  ieB:IeBill;
  groups:Array<Group> = [];

  constructor(private api: ApiService,private router:Router) {}

  ngOnInit(): void {
    this.load();
  }

  async load() {
    this.shop = JSON.parse(localStorage.getItem('shop-infor') || '{}');
    this.staff = JSON.parse(localStorage.getItem('staff-infor') || '{}');
    let splitDate: Array<string> = this.api.getCurrentDate().split('-');
    this.date = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`;
    let request: DataRequest = {
      mode: 'get',
      data: '',
    };
    await this.api.group(request).toPromise().then((res:any)=>{
      res.forEach((g:Group)=>{
        if(g.type === "warehouse"){
          this.groups.push(g);
        }
      });
    });
    await this.api
      .goods(request)
      .toPromise()
      .then((res: any) => {
        res.forEach((g: Goods) => {
          this.goods.push({ ...g, isChoose: false });
          this.goodsLU.push({ ...g, isChoose: false });
        });
      });
    await this.api
      .ieBill({ mode: 'get-by-shop', data: this.shop.id })
      .toPromise()
      .then(async (res: any) => {
        let ie: IeBill;
        for (ie of res) {
          let ieDate: string = this.api.ieCreateDate(ie);
          if (
            ieDate === this.api.getCurrentDate() &&
            ie.status === 'not_confirm' &&
            ie.type === 'export'
          ) {
            this.ieB = ie;
            await this.api
              .ieDetail({ mode: 'get', data: ie.id })
              .toPromise()
              .then((response: any) => {
                response.forEach((ied: IeDetail) => {
                  let cartItem: IeDetailInfor = {
                    ...ied,
                    name: this.getName(ied.itemID),
                    price: this.getPrice(ied.itemID),
                    unit: this.getUnit(ied.itemID),
                  };
                  this.cart.push(cartItem);
                  this.type = 'edit';
                  this.changeStatusGoods(ied.itemID, true);
                });
              });
            this.getTotal();
          }
        }
      });
  }
  getName(gID: number): string {
    let n: string = '';
    this.goods.forEach((g: Goods) => {
      if (g.id === gID) {
        n = g.name;
      }
    });
    return n;
  }
  getPrice(gID: number): number {
    let p: number = 0;
    this.goods.forEach((g: Goods) => {
      if (g.id === gID) {
        p = g.price;
      }
    });
    return p;
  }
  getUnit(gID: number): string {
    let u: string = '';
    this.goods.forEach((g: Goods) => {
      if (g.id === gID) {
        u = g.unit;
      }
    });
    return u;
  }
  changeStatusGoods(idG: number, status: boolean) {
    this.goods.forEach((g: GoodsInfor) => {
      if (g.id === idG) {
        g.isChoose = status;
      }
    });
    this.goodsLU.forEach((g: GoodsInfor) => {
      if (g.id === idG) {
        g.isChoose = status;
      }
    });
  }
  getTotal() {
    this.total = 0;
    this.cart.forEach((ieD: IeDetailInfor) => {
      this.total = this.total + ieD.price * ieD.num;
    });
  }
  addCart(g:GoodsInfor){
    let newCI:IeDetailInfor = {
      id: 0,
      itemID: g.id,
      num: 1,
      ieID: 0,
      note: "",
      price: g.price,
      name: g.name,
      unit: g.unit
    };
    let isExist:boolean = false
    this.cart.forEach((ci:IeDetail)=>{
      if(ci.itemID === g.id){
        ci.num = 1;
        isExist = true;
      }
    });
    if(isExist === false){
      this.cart.push(newCI);
    }
    this.getTotal();
    this.changeStatusGoods(g.id,true);
  }
  delete(ied:IeDetailInfor){
    let index:number = this.cart.indexOf(ied);
    this.cart[index].num = 0;
    this.getTotal();
    this.changeStatusGoods(ied.itemID,false);
  }
  search(){
    let searchValue:string = this.searchInput.nativeElement.value;
    this.goods = [];
    if(searchValue.length <= 0){
      this.goods = this.goodsLU;
    }else{
      this.goodsLU.forEach((g:GoodsInfor)=>{
        if(this.api.removeAccents(g.name.toLowerCase()).indexOf(this.api.removeAccents(searchValue.toLowerCase())) != -1){
          this.goods.push(g);
        }
      });
    }
  }
  save(){
    if(this.type === "create"){
      let acceptItems:Array<IeDetailInfor> = this.cart.filter((ci:IeDetailInfor)=>{
        return ci.num > 0;
      });
      if(acceptItems.length <= 0){
        alert("Chọn ít nhất 1 mặt hàng để lưu đơn !")
      }else{
        let newIE:IeBill = {
          id:0,
          createAt: this.api.getCurrentDateTime(),
          confirmAt: this.api.getCurrentDateTime(),
          staffID:this.staff.id,
          shopID:this.shop.id,
          status:"not_confirm",
          type:"export"
        };
        let request:DataRequest = {
          mode:"create",
          data:newIE
        };
        this.api.ieBill(request).subscribe((res:any)=>{
          if(res.id != undefined && res.id !=0 && res.id != null){
            this.cart.forEach((ci:IeDetailInfor)=>{
              if(ci.num > 0){
                let ieDetai:IeDetail = {
                  id:ci.id,
                  itemID:ci.itemID,
                  num:ci.num,
                  note:ci.note,
                  ieID:res.id
                };
                this.api.ieDetail({mode:"create",data:ieDetai}).subscribe((res:any)=>{});
              }
            });
            alert("Lưu thành công!");
            this.router.navigate(["/goods"]);
          }else{
            alert("Đã có lỗi ra, hãy thử lại!");
          }
        });
      }
    }else{
      let acceptItems:Array<IeDetailInfor> = this.cart.filter((ci:IeDetailInfor)=>{
        return ci.num > 0;
      });
      if(acceptItems.length <= 0){
        if(confirm("Bạn muốn huỷ đơn hàng ?")){
          this.ieB.status = "delete";
          this.api.ieBill({mode:"update",data:this.ieB}).subscribe((res:any)=>{
            if(res.affected === 1){
              alert("Huỷ thành công !");
              this.router.navigate(["/goods"])
            }
          });
        }
      }else{
        this.cart.forEach((ci:IeDetailInfor)=>{
          if(ci.id === 0){
            if(ci.num > 0){
              let ieDetai:IeDetail = {
                id:ci.id,
                itemID:ci.itemID,
                num:ci.num,
                note:ci.note,
                ieID:this.ieB.id,
              };
              this.api.ieDetail({mode:"create",data:ieDetai}).subscribe((res:any)=>{});
            }
          }else{
            if(ci.num > 0){
              let ieDetai:IeDetail = {
                id:ci.id,
                itemID:ci.itemID,
                num:ci.num,
                note:ci.note,
                ieID:this.ieB.id,
              };
              this.api.ieDetail({mode:"update",data:ieDetai}).subscribe((res:any)=>{});
            }else{
              this.api.ieDetail({mode:"delete",data:ci.id}).subscribe((res:any)=>{});
            }
          }
        });
        alert("Cập nhật thành công !")
        this.router.navigate(["/goods"]);
      }
    }
  }
  filterSelect(){
    this.goods = [];
    let grID:number = Number(this.groupSelect.nativeElement.value);
    if(grID === 0){
      this.goods = this.goodsLU;
    }else{
      this.goods = this.goodsLU.filter((g:GoodsInfor)=>{
        return g.groupID === grID;
      });
    }
  }
  back(){
    this.router.navigate(["/goods"]);
  }
}
