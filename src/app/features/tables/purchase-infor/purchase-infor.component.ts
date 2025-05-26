import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/core/Service/api.service';
import { Shop } from 'src/app/shared/Models/shop';

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

@Component({
  selector: 'app-purchase-infor',
  templateUrl: './purchase-infor.component.html',
  styleUrls: ['./purchase-infor.component.css']
})
export class PurchaseInforComponent implements OnInit {
  @Input() data:BillInfor;
  shop:Shop;
  qrSource:string;
  vietQrURL:string;

  constructor(private api:ApiService,private bsRef:BsModalRef) { }

  ngOnInit(): void {
    this.load();
  }

  load(){
    this.shop = JSON.parse(localStorage.getItem("shop-infor") || "{}");
    this.api.getQr({money:this.data.total,staff:this.data.staffID.toString(),table:this.data.table}).subscribe((res:any)=>{
      this.qrSource = res;
    });
    this.vietQrURL=`https://img.vietqr.io/image/${this.shop.bankID}-${this.shop.account_no}-compact2.jpg?amount=${this.data.total}&addInfo=thanh%20toan%20ban%20${this.data.table}%20id%20${this.data.id}`;
  }

  close(){
    this.bsRef.hide();
  }
}
