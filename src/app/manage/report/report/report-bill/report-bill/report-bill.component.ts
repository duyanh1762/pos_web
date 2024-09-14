import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DetailComponent } from 'src/app/manage/sale/sale/detail/detail.component';
import { Bill } from 'src/app/Models/bill';
import { BillDetail } from 'src/app/Models/bill_detail';
import { Item } from 'src/app/Models/item';
import { Shop } from 'src/app/Models/shop';
import { Staff } from 'src/app/Models/staff';
import { ApiService } from 'src/app/Service/api.service';
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
interface DetailItem{
  id: number;
  itemID: number;
  num: number;
  billID:number;
  policyID:number;
  name:string,
  total:number,
  status:string, // value: isCount | notCount
  percent:number,
}
@Component({
  selector: 'app-report-bill',
  templateUrl: './report-bill.component.html',
  styleUrls: ['./report-bill.component.css'],
})
export class ReportBillComponent implements OnInit {

  @ViewChild('selectStaff', { read: ElementRef, static: false })
  selectStaff: ElementRef;
  @ViewChild('selectStatus', { read: ElementRef, static: false })
  selectStatus: ElementRef;
  @ViewChild('tableN', { read: ElementRef, static: false }) tableN: ElementRef;

  startDate: Date | null = null;
  endDate: Date | null = null;
  shop: Shop;
  staffs: Array<Staff> = [];
  bills: Array<BillInfor> = [];
  billsLU: Array<BillInfor> = [];
  items: Array<Item> = [];
  detailItems:Array<DetailItem> = [];
  constructor(private api: ApiService, private bsModal:BsModalService) {}

  ngOnInit(): void {
    this.load();
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
 async confirmDate() {
    this.billsLU.splice(0, this.billsLU.length);
    this.detailItems.splice(0,this.detailItems.length);
    if (this.startDate != null && this.endDate != null) {
      this.billsLU = this.bills.filter((b:BillInfor)=>{
        return new Date(b.date) >= this.startDate! &&  new Date(b.date) <= this.endDate!;
      });
      for (let bi of this.billsLU){
        const res: any = await this.api.details({ mode: "get", data: bi.id }).toPromise();

        for (const d of res) {
          let n: string = "";
          let t: number = 0;

          const item = this.items.find((i: Item) => i.id === d.itemID);
          if (item) {
            t = d.num * item.price;
            n = item.name;
          }
          const detailItem: DetailItem = {
            ...d,
            total: t,
            name: n,
            status: "notCount",
            percent:0,
          };

          this.detailItems.push(detailItem);
        }
      };
      for(let i = 0; i < this.detailItems.length;i++){
        if(this.detailItems[i].status === "notCount"){
          for(let j = i + 1; j < this.detailItems.length;j++){
            if(this.detailItems[i].itemID === this.detailItems[j].itemID){
              this.detailItems[i].num = this.detailItems[i].num + this.detailItems[j].num;
              this.detailItems[i].total = this.detailItems[i].total + this.detailItems[j].total;
              this.detailItems[j].status = "isCount";
            }
          }
        }else{
          continue;
        }
      }
      let totalItems:number = 0;
      this.detailItems = this.detailItems.filter((di:DetailItem)=>{
        if(di.status === "notCount"){
          totalItems = totalItems + di.num;
        }
        return di.status === "notCount";
      });
      this.detailItems.forEach((di:DetailItem)=>{
        di.percent =  Number(((di.num / totalItems)*100).toFixed(1));
      });
    } else {
      alert('Hãy chọn khoảng thời gian bạn muốn xem báo cáo !');
    }
  }
  async load() {
    this.shop = JSON.parse(localStorage.getItem('shop-infor') || '{}');
    let request = {
      mode: 'get',
      data: '',
    };
    await this.api
      .item(request)
      .toPromise()
      .then((res: any) => {
        this.items = res;
      });
    await this.api
      .staff(request)
      .toPromise()
      .then((res: any) => {
        res.forEach((s: Staff) => {
          if (s.shopID === this.shop.id) {
            this.staffs.push(s);
          }
        });
      });
    await this.api
      .bill(request)
      .toPromise()
      .then((res: any) => {
        res.forEach(async (b: Bill) => {
          if (b.shopID === this.shop.id) {
            let name: string = '';
            let total: number = 0;
            let bi: BillInfor = {
              ...b,
              nameStaff: '',
              total: 0,
            };
            await this.api
              .details({ mode: 'get', data: Number(b.id) })
              .toPromise()
              .then((res: any) => {
                res.forEach(async (d: BillDetail) => {
                  this.items.forEach((i: Item) => {
                    if (d.itemID === i.id) {
                      total = total + d.num * i.price;
                    }
                  });
                });
              });
            this.staffs.forEach((s: Staff) => {
              if (b.staffID === s.id) {
                name = s.name;
              }
            });
            bi.nameStaff = name;
            bi.total = total;
            this.bills.push(bi);
          }
        });
      });
  }
  filter() {
    let billFollowDate:Array<BillInfor> = this.bills.filter((b:BillInfor)=>{
      return new Date(b.date) >= this.startDate! &&  new Date(b.date) <= this.endDate!;
    });
    let table = this.tableN.nativeElement.value;
    let status = this.selectStatus.nativeElement.value;
    let staff = this.selectStaff.nativeElement.value;
    if (staff === 'all' && status === 'all' && table === '') {
      this.billsLU = billFollowDate;
    } else if (staff === 'all' && status === 'all' && table != '') {
      this.billsLU = billFollowDate.filter((b: BillInfor) => {
        return b.table === table;
      });
    } else if (staff === 'all' && status != 'all' && table === '') {
      this.billsLU = billFollowDate.filter((b: BillInfor) => {
        return b.status === status;
      });
    } else if (staff != 'all' && status === 'all' && table === '') {
      this.billsLU = billFollowDate.filter((b: BillInfor) => {
        return b.staffID === Number(staff);
      });
    } else if (staff != 'all' && status != 'all' && table === '') {
      this.billsLU = billFollowDate.filter((b: BillInfor) => {
        return b.staffID === Number(staff) && b.status === status;
      });
    } else if (staff != 'all' && status === 'all' && table != '') {
      this.billsLU = billFollowDate.filter((b: BillInfor) => {
        return b.staffID === Number(staff) && b.table === table;
      });
    } else if (staff === 'all' && status != 'all' && table != '') {
      this.billsLU = billFollowDate.filter((b: BillInfor) => {
        return b.status === status && b.table === table;
      });
    } else if (staff != 'all' && status != 'all' && table != '') {
      this.billsLU = billFollowDate.filter((b: BillInfor) => {
        return (
          b.staffID === Number(staff) &&
          b.status === status &&
          b.table === table
        );
      });
    }
  }
  datePipe(date:string | any){
    return this.api.dateTransform(date);
  }
  showDetail(id:number){
    this.bsModal.show(DetailComponent,{
      initialState:{
        data:id
      }
    });
  }
  test():Array<DetailItem>{
    for(let i = 0; i < this.detailItems.length;i++){
      if(this.detailItems[i].status === "notCount"){
        for(let j = i + 1; j < this.detailItems.length;j++){
          if(this.detailItems[i].itemID === this.detailItems[j].itemID){
            this.detailItems[i].num = this.detailItems[i].num + this.detailItems[j].num;
            this.detailItems[j].status = "isCount";
          }
        }
      }else{
        continue;
      }
    }
    return this.detailItems;
  }
}
