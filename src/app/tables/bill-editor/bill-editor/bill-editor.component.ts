import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { emit } from 'process';
import { map } from 'rxjs';
import { DataRequest } from 'src/app/Interface/data_request';
import { Bill } from 'src/app/Models/bill';
import { BillDetail } from 'src/app/Models/bill_detail';
import { Item } from 'src/app/Models/item';
import { Policy } from 'src/app/Models/policy';
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
  update: boolean;
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
  total: number = 0;
  constructor(
    private api: ApiService,
    private bsModalRef: BsModalRef,
    private http: HttpClient,
    private router: Router
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
  }
}
