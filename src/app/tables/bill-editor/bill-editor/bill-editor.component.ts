import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { emit } from 'process';
import { map } from 'rxjs';
import { DataRequest } from 'src/app/Interface/data_request';
import { Bill } from 'src/app/Models/bill';
import { BillDetail } from 'src/app/Models/bill_detail';
import { Item } from 'src/app/Models/item';
import { ApiService } from 'src/app/Service/api.service';
import { PurchaseInforComponent } from '../../purchase-infor/purchase-infor.component';

interface DetailInfor {
  id: number;
  itemID: number;
  num: number;
  billID: number;
  policyID: number;
  price: number;
  name: string;
  total: number;
  note:string,
  update: boolean;
}
interface ItemOrder{
  id: number;
  itemID:number;
  num: number,
  billID: number;
  name:string;
  table:string | undefined;
  note:string,
  status:string; // confirm | not_confirm
}

interface BillInfor{
  id: number;
  date:string;
  table: string | null;
  staffID: number;
  shopID:number;
  status:string;
  policyID:number;
  details:Array<DetailInfor>,
  total:number
}

@Component({
  selector: 'app-bill-editor',
  templateUrl: './bill-editor.component.html',
  styleUrls: ['./bill-editor.component.css'],
})
export class BillEditorComponent implements OnInit {
  @Input() data: Bill;
  @Output() closed = new EventEmitter();

  listDetail: Array<BillDetail>;
  listDetailLU: Array<DetailInfor | BillDetail | any>;
  dataCompare:Array<DetailInfor> = [];
  total: number = 0;

  constructor(
    private api: ApiService,
    private bsModalRef: BsModalRef,
    private http: HttpClient,
    private router: Router,
    private bsMS: BsModalService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  async load() {
    let request = {
      mode: 'get',
      data: Number(this.data.id),
    };
    let responseDetail: Array<BillDetail> = [];
    let responseItem: Array<Item> = [];
    await this.api
      .details(request)
      .toPromise()
      .then((response: any) => {
        responseDetail = response;
      });
    await this.api
      .item(request)
      .toPromise()
      .then((response: any) => {
        responseItem = response;
      });
    this.listDetail = responseDetail;
    this.listDetailLU = responseDetail.map((detail) => {
      let p, n, t;
      for (let i = 0; i < responseItem.length; i++) {
        if (detail.itemID === responseItem[i].id) {
          p = responseItem[i].price;
          n = responseItem[i].name;
          t = Number(detail.num) * p;
        }
      }
      this.total = this.total + Number(t);
      return {
        ...detail,
        price: Number(p),
        name: n,
        total: Number(t),
        update: false,
      };
    });
    this.dataCompare = JSON.parse(JSON.stringify(this.listDetailLU));
  }
  plus(id: number) {
    this.listDetailLU.forEach((item: DetailInfor) => {
      if (item.id === id) {
        item.num = item.num + 1;
        item.update = true;
        this.total = this.total + item.price;
      }
    });
  }
  minus(id: number) {
    this.listDetailLU.forEach((item: DetailInfor) => {
      if (item.id === id) {
        if (item.num >= 1) {
          item.num = item.num - 1;
          item.update = true;
          this.total = this.total - item.price;
        } else {
          item.num = 0;
          item.update = true;
        }
      }
    });
  }
  remove(id: number) {
    this.listDetailLU.forEach((item: DetailInfor) => {
      if (item.id === id) {
        this.total = this.total - item.num * item.price;
        item.num = 0;
        item.update = true;
      }
    });
  }
  save() {
    let queueDetail: Array<BillDetail> = [];
    for (let i = 0; i < this.listDetail.length; i++) {
      for (let i = 0; i < this.listDetailLU.length; i++) {
        if (
          this.listDetail[i].id === this.listDetailLU[i].id &&
          this.listDetailLU[i].update === true
        ) {
          this.listDetail[i].num = this.listDetailLU[i].num;
          this.listDetailLU[i].update = false;
          queueDetail.push(this.listDetail[i]);
        }
      }
    }
    if (queueDetail.length <= 0) {
      this.bsModalRef.hide();
    } else {
      let checkNum: boolean = false;
      this.listDetail.forEach((data) => {
        if (data.num > 0) {
          checkNum = true;
        }
      });
      if (checkNum === false) {
        if(confirm("Bạn có chắc chắn muốn huỷ hoá đơn này ?")){
          this.data.status="delete";
          this.api.bill({mode:"update",data:this.data}).subscribe((res)=>{});
          this.closed.emit(this.data);
          this.bsModalRef.hide();
          this.dataCompare.forEach((d:DetailInfor)=>{
            let newOrder:ItemOrder = {
              id: d.id,
              itemID: d.itemID,
              num: d.num,
              billID: this.data.id,
              note:d.note,
              name:d.name+" ( Huỷ)",
              table:this.data.table?.toString(),
              status:"not_confirm"
            };
            this.api.sendOrder(newOrder);
          });
        }else{
          this.bsModalRef.hide();
        }
      } else {
        for (let i = 0; i < queueDetail.length; i++) {
          if (queueDetail[i].num > 0) {
            let request: DataRequest = {
              mode: 'update',
              data: queueDetail[i],
            };
            this.api.details(request).subscribe((rs)=>{});
          } else {
            let request: DataRequest = {
              mode: 'delete',
              data: queueDetail[i],
            };
            this.api.details(request).subscribe((rs)=>{});
          }
          this.dataCompare.forEach((d:DetailInfor)=>{
            if(d.id === queueDetail[i].id){
              let n:number = queueDetail[i].num - d.num;
              if(n > 0){
                let newOrder:ItemOrder = {
                  id: d.id,
                  itemID: d.itemID,
                  num: n,
                  billID: this.data.id,
                  name: d.name,
                  note:d.note,
                  table: this.data.table?.toString(),
                  status: "not_confirm"
                };
                this.api.sendOrder(newOrder);
              }else if(n < 0){
                let newOrder:ItemOrder = {
                  id: d.id,
                  itemID: d.itemID,
                  num: n,
                  billID: this.data.id,
                  name: d.name + " (Huỷ)",
                  note:d.note,
                  table: this.data.table?.toString(),
                  status: "not_confirm"
                };
                this.api.sendOrder(newOrder);
              }
            }
          });
        }
        this.bsModalRef.hide();
      }
    }
  }
  edit(table: string | null) {
    this.router.navigate(['/tables/order/' + table]);
    this.bsModalRef.hide();
  }
  purchase(){
    this.data.status = "pay";
    let request = {
      mode:"update",
      data: this.data,
    }
    this.api.bill(request).subscribe((res)=>{});
    this.closed.emit(this.data);
    this.bsModalRef.hide();

    let billInfor:BillInfor = {
      ...this.data,
      total:this.total,
      details:this.listDetailLU,
    }
    this.bsMS.show(PurchaseInforComponent,{
      initialState:{
        data:billInfor
      }
    });
  }
}
