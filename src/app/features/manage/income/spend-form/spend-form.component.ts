import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/core/Service/api.service';
import { DataRequest } from 'src/app/shared/Interface/data_request';
import { Spend } from 'src/app/shared/Models/spend';

@Component({
  selector: 'app-spend-form',
  templateUrl: './spend-form.component.html',
  styleUrls: ['./spend-form.component.css']
})
export class SpendFormComponent implements OnInit {
  @Input() data:any;
  @Output() response = new EventEmitter();

  date:string;
  des:string;
  total:number;

  constructor(private bsRef:BsModalRef,private api:ApiService) { }

  ngOnInit(): void {
    this.load();
  }
  load(){
    if(this.data.type === "edit"){
      this.des = this.data.data.des;
      this.total = this.data.data.total;
      this.date = this.data.data.date;
    }
  }
  onSubmit(){
    if(this.data.type === "create"){
      let newSpend:Spend = {
        id:0,
        shopID:this.data.shopID,
        staffID:this.data.staffID,
        status:"Active",
        des:this.des,
        total:Number(this.total),
        date:this.api.getCurrentDateTime()
      } ;
      let request:DataRequest = {
        mode:"create",
        data:newSpend
      };
      this.api.spend(request).toPromise().then((res:any)=>{
        if(res.result){
          alert("Đã có lỗi xảy ra , tạo mới thất bại !");
        }else{
          alert("Tạo phiếu chi thành công !");
          let dateTranform = res.date.split(" ")[0].split("-")[2] + "-" + res.date.split(" ")[0].split("-")[1] + "-" + res.date.split(" ")[0].split("-")[0] + " " + res.date.split(" ")[1];
          res.date = dateTranform;
          this.bsRef.hide();
          this.response.emit(res);
        }
      });
    }else{
      let dateArr = this.date.split(" ")[0].split("-");
      let time = this.date.split(" ")[1];
      let dateTimeSQL = dateArr[2]+"-"+dateArr[1]+"-"+dateArr[0] + " " + time;
      let updateSpend:Spend = {
        id:this.data.data.id,
        shopID:this.data.data.shopID,
        staffID:this.data.data.staffID,
        status:this.data.data.status,
        des:this.des,
        total:this.total,
        date:dateTimeSQL
      };
      let request:DataRequest = {
        mode:"update",
        data:updateSpend
      };
      this.api.spend(request).toPromise().then((res:any)=>{
        if(res.affected === 1){
          alert("Cập nhật thành công !");
          this.response.emit(updateSpend);
          this.bsRef.hide();
        }else{
          alert("Đã có lỗi xảy ra , cập nhật thất bại !")
        }
      });
    }
  }
}
