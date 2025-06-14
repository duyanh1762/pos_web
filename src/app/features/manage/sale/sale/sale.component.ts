import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DetailComponent } from './detail/detail.component';
import { Shop } from 'src/app/shared/Models/shop';
import { ApiService } from 'src/app/core/Service/api.service';
import { Item } from 'src/app/shared/Models/item';
import { Staff } from 'src/app/shared/Models/staff';
import { Bill } from 'src/app/shared/Models/bill';
import { BillDetail } from 'src/app/shared/Models/bill_detail';
interface BillInfor {
  id: number;
  date: string;
  table: string | null;
  staffID: number;
  shopID: number;
  status: string;
  policyID: number;
  nameStaff: string;
  total: number;
}
interface StaffInfor {
  id: number;
  name: string;
  total: number;
}
@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css'],
})
export class SaleComponent implements OnInit {
  @ViewChild('selectStaff', { read: ElementRef, static: false })
  selectStaff: ElementRef;
  @ViewChild('selectStatus', { read: ElementRef, static: false })
  selectStatus: ElementRef;
  @ViewChild('tableN', { read: ElementRef, static: false }) tableN: ElementRef;

  public shop: Shop;
  public paid: number = 0;
  public unpaid: number = 0;
  public staffs: Array<StaffInfor> = [];
  public tableNum: number = 0;
  public bills: Array<BillInfor> = [];
  public billsLU: Array<BillInfor> = [];
  public unpaidBills:Array<BillInfor> = [];
  public lastFilter: Array<BillInfor> = [];
  public sortType :string = "up"; // up | down

  constructor(private api: ApiService,private bsModal:BsModalService) {}

  ngOnInit(): void {
    this.load();
  }
  async load() {
    let items: Array<Item> = [];
    this.shop = JSON.parse(localStorage.getItem('shop-infor') || '{}');
    let request = {
      mode: 'get',
      data: '',
    };
    await this.api
      .staff(request)
      .toPromise()
      .then((res: any) => {
        res.forEach((s: Staff) => {
          if (s.shopID === this.shop.id && s.status === "Active") {
            let si = {
              id: s.id,
              name: s.name,
              total: 0,
            };
            this.staffs.push(si);
          }
        });
      });
    await this.api
      .item(request)
      .toPromise()
      .then((res: any) => {
        items = res;
      });
    await this.api
      .bill(request)
      .toPromise()
      .then((res: any) => {
        res.forEach(async (i: Bill) => {
          if (
            i.shopID === this.shop.id &&
            this.api.getCurrentDate() === this.api.billDate(i)
          ) {
            let n = '';
            let t = 0;
            await this.api
              .details({ mode: 'get', data: Number(i.id) })
              .toPromise()
              .then((res: any) => {
                res.forEach((d: BillDetail) => {
                  items.forEach((item: Item) => {
                    if (d.itemID === item.id) {
                      t = t + d.num * item.price;
                    }
                  });
                });
              });
            for (let y = 0; y < this.staffs.length; y++) {
              if (this.staffs[y].id === i.staffID) {
                n = this.staffs[y].name;
                break;
              }
            }
            let b = {
              ...i,
              nameStaff: n,
              total: t,
            };
            let newDate = this.api.dateTransform(b.date).split(" ");
            b.date = newDate[1];
            this.bills.push(b);
            this.billsLU.push(b);
            this.staffs.forEach((si: StaffInfor) => {
              if (b.staffID === si.id && b.status === 'pay') {
                si.total = si.total + b.total;
              }
            });
            if (i.status === 'pay') {
              this.paid = this.paid + b.total;
            } else if (i.status === 'not_pay') {
              this.unpaid = this.unpaid + b.total;
              this.tableNum = this.tableNum + 1;
            }
          }else if(i.shopID === this.shop.id && this.api.getCurrentDate() != this.api.billDate(i) && i.status === "not_pay"){
            let n:string = "";
            let t:number = 0;
            await this.api.details({mode:"get",data:i.id}).toPromise().then((res:any)=>{
              res.forEach((d:BillDetail)=>{
                items.forEach((i:Item)=>{
                  if(d.itemID === i.id){
                    t = t + d.num * i.price;
                  }
                });
              });
            });
            this.staffs.forEach((s:any)=>{
              if(s.id === i.staffID){
                n = s.name;
              }
            });
            let uBill:BillInfor = {
              ...i,
              nameStaff:n,
              total:t
            };
            this.unpaidBills.push(uBill);
          }
        });
      });
  }
  filter() {
    let table = this.tableN.nativeElement.value;
    let status = this.selectStatus.nativeElement.value;
    let staff = this.selectStaff.nativeElement.value;
    if(staff === "all"  && status === "all" && table === ""){
      this.billsLU = this.bills;
    }else if(staff === "all" && status === "all" && table != ""){
      this.billsLU = this.bills.filter((b: BillInfor) => {
        return b.table === table;
      });
    }else if(staff === "all" && status != "all" && table === ""){
      this.billsLU = this.bills.filter((b: BillInfor) => {
        return b.status === status;
      });
    }else if(staff != "all" && status === "all" && table === ""){
      this.billsLU = this.bills.filter((b: BillInfor) => {
        return b.staffID === Number(staff);
      });
    }else if(staff != "all" && status != "all" && table === ""){
      this.billsLU = this.bills.filter((b: BillInfor) => {
        return b.staffID === Number(staff) && b.status === status;
      });
    }else if(staff != "all" && status === "all" && table != ""){
      this.billsLU = this.bills.filter((b: BillInfor) => {
        return b.staffID === Number(staff) && b.table === table;
      });
    }else if(staff === "all" && status != "all" && table != ""){
      this.billsLU = this.bills.filter((b: BillInfor) => {
        return b.status === status && b.table === table;
      });
    }else if(staff != "all" && status != "all" && table != ""){
      this.billsLU = this.bills.filter((b: BillInfor) => {
        return b.staffID === Number(staff) && b.status === status && b.table === table;
      });
    }
  }
  showDetails(id:number){
    this.bsModal.show(DetailComponent,{
      initialState:{
        data:id,
      }
    });
  }
  sort(data:string){
    if(this.sortType === "up"){
      if(data === "table" || data === "total"){
        for(let i = 0;i < this.billsLU.length;i++){
          for(let j = i + 1; j< this.billsLU.length;j++){
            if(Number(this.billsLU[i][data]) > Number(this.billsLU[j][data])){
              let temp = this.billsLU[i];
              this.billsLU[i]=this.billsLU[j];
              this.billsLU[j]=temp;
            }
          }
        }
      }else{
        for(let i = 0;i < this.billsLU.length;i++){
          for(let j = i + 1; j< this.billsLU.length;j++){
            let eI = new Date(`1970-01-01T${this.billsLU[i].date}`);
            let eJ = new Date(`1970-01-01T${this.billsLU[j].date}`);
            if(eI > eJ){
              let temp = this.billsLU[i];
              this.billsLU[i] = this.billsLU[j];
              this.billsLU[j] = temp;
            }
          }
        }
      }
      this.sortType = "down";
    }else{
      if(data === "table" || data === "total"){
        for(let i = 0;i<this.billsLU.length;i++){
          for(let j = i + 1;j<this.billsLU.length;j++){
            if(Number(this.billsLU[i][data]) < Number(this.billsLU[j][data])){
              let temp = this.billsLU[i];
              this.billsLU[i] = this.billsLU[j];
              this.billsLU[j] = temp;
            }
          }
        }
      }else{
        for(let i = 0;i < this.billsLU.length;i++){
          for(let j = i + 1; j< this.billsLU.length;j++){
            let eI = new Date(`1970-01-01T${this.billsLU[i].date}`);
            let eJ = new Date(`1970-01-01T${this.billsLU[j].date}`);
            if(eI < eJ){
              let temp = this.billsLU[i];
              this.billsLU[i] = this.billsLU[j];
              this.billsLU[j] = temp;
            }
          }
        }
      }
      this.sortType = "up";
    }
  }
  sortUnpaid(data:string){
    if(this.sortType === "up"){
      if(data === "table" || data === "total"){
        for(let i = 0;i < this.unpaidBills.length;i++){
          for(let j = i + 1; j< this.unpaidBills.length;j++){
            if(Number(this.unpaidBills[i][data]) > Number(this.unpaidBills[j][data])){
              let temp = this.unpaidBills[i];
              this.unpaidBills[i]=this.unpaidBills[j];
              this.unpaidBills[j]=temp;
            }
          }
        }
      }else{
        for(let i = 0;i < this.unpaidBills.length;i++){
          for(let j = i + 1; j< this.unpaidBills.length;j++){
            let eI = new Date(`${this.unpaidBills[i].date}`);
            let eJ = new Date(`${this.unpaidBills[j].date}`);
            if(eI > eJ){
              let temp = this.unpaidBills[i];
              this.unpaidBills[i] = this.unpaidBills[j];
              this.unpaidBills[j] = temp;
            }
          }
        }
      }
      this.sortType = "down";
    }else{
      if(data === "table" || data === "total"){
        for(let i = 0;i<this.unpaidBills.length;i++){
          for(let j = i + 1;j<this.unpaidBills.length;j++){
            if(Number(this.unpaidBills[i][data]) < Number(this.unpaidBills[j][data])){
              let temp = this.unpaidBills[i];
              this.unpaidBills[i] = this.unpaidBills[j];
              this.unpaidBills[j] = temp;
            }
          }
        }
      }else{
        for(let i = 0;i < this.unpaidBills.length;i++){
          for(let j = i + 1; j< this.unpaidBills.length;j++){
            let eI = new Date(`${this.unpaidBills[i].date}`);
            let eJ = new Date(`${this.unpaidBills[j].date}`);
            if(eI < eJ){
              let temp = this.unpaidBills[i];
              this.unpaidBills[i] = this.unpaidBills[j];
              this.unpaidBills[j] = temp;
            }
          }
        }
      }
      this.sortType = "up";
    }
  }
  getDate():string{
    let arrDate = this.api.getCurrentDate().split("-");
    return arrDate[2]+"-"+arrDate[1]+"-"+arrDate[0];
  }
  apiDate(data:string){
    return this.api.dateTransform(data);
  }
  confirmUnpaid(b:BillInfor){
    let updateBill:Bill = {
      id:b.id,
      date:b.date,
      table: b.table,
      staffID: b.staffID,
      shopID:b.shopID,
      status:"pay",
      policyID:b.policyID
    };
    this.api.bill({mode:"update",data:updateBill}).subscribe((res:any)=>{
      if(res.affected === 1){
        alert("Thanh toán thành công !");
        let index:number = this.unpaidBills.indexOf(b);
        this.unpaidBills.splice(index,1);
      }else{
        alert("Có lỗi xảy ra !");
      }
    });
  }
}
