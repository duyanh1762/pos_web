import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
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
  // public sum:number=0;
  public bills: Array<BillInfor> = [];
  public billsLU: Array<BillInfor> = [];
  public lastFilter: Array<BillInfor> = [];
  constructor(private api: ApiService) {}

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
      .getStaff(request)
      .toPromise()
      .then((res: any) => {
        res.forEach((s: Staff) => {
          if (s.shopID === this.shop.id) {
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
      .getItems(request)
      .toPromise()
      .then((res: any) => {
        items = res;
      });
    await this.api
      .getBill(request)
      .toPromise()
      .then((res: any) => {
        res.forEach(async (i: Bill) => {
          if (
            i.shopID === this.shop.id &&
            this.api.getCurrentDate() === this.api.getBillDate(i)
          ) {
            let n = '';
            let t = 0;
            await this.api
              .getDetail({ mode: 'get', data: Number(i.id) })
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
            let newDate = this.api.dateTransform(b.date);
            b.date = newDate;
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

}
