import { Component, Input, OnInit } from '@angular/core';
import { table } from 'console';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/Service/api.service';

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
  update: boolean;
}

@Component({
  selector: 'app-purchase-infor',
  templateUrl: './purchase-infor.component.html',
  styleUrls: ['./purchase-infor.component.css']
})
export class PurchaseInforComponent implements OnInit {
  @Input() data:BillInfor;

  qrSource:string;

  constructor(private api:ApiService,private bsRef:BsModalRef) { }

  ngOnInit(): void {
    this.load();
  }

  load(){
    this.api.getQr({money:this.data.total,staff:this.data.staffID.toString(),table:this.data.table}).subscribe((res:any)=>{
      this.qrSource = res;
    });
  }

  close(){
    this.bsRef.hide();
  }
}
