import { Component, OnInit } from '@angular/core';
import { Bill } from 'src/app/Models/bill';
import { BillDetail } from 'src/app/Models/bill_detail';
import { Item } from 'src/app/Models/item';
import { Shop } from 'src/app/Models/shop';
import { Staff } from 'src/app/Models/staff';
import { ApiService } from 'src/app/Service/api.service';

interface StaffInfor {
  id: number;
  shopID: number;
  name: string;
  status: string;
  total: number;
}
@Component({
  selector: 'app-report-staff',
  templateUrl: './report-staff.component.html',
  styleUrls: ['./report-staff.component.css'],
})
export class ReportStaffComponent implements OnInit {
  startDate: Date | null = null;
  endDate: Date | null = null;
  items: Array<Item> = [];
  staffs: Array<StaffInfor> = [];
  shop: Shop;
  bills: Array<Bill> = [];
  renuvalue:number=0;
  export:boolean = false;
  constructor(private api: ApiService) {}

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
      .bill(request)
      .toPromise()
      .then((res: any) => {
        res.forEach((b: Bill) => {
          if (b.shopID === this.shop.id) {
            this.bills.push(b);
          }
        });
      });
    await this.api
      .staff(request)
      .toPromise()
      .then((res: any) => {
        res.forEach((s: Staff) => {
          if (this.shop.id === s.shopID && s.status === "Active") {
            let si = {
              id: s.id,
              shopID: s.shopID,
              name: s.name,
              status: s.status,
              total: 0,
            };
            this.staffs.push(si);
          }
        });
      });
  }
  confirmDate() {
    this.staffs.forEach((si:StaffInfor)=>{
      si.total = 0;
    });
    this.renuvalue = 0;
    this.bills.forEach((b: Bill) => {
      let billDate = new Date(b.date);
      if (this.startDate != null && this.endDate != null) {
        if (billDate >= this.startDate && billDate <= this.endDate && b.status === "pay") {
          this.export = true;
          this.staffs.forEach(async (si: StaffInfor) => {
            if (si.id === b.staffID) {
              await this.api
                .details({ mode: 'get', data: Number(b.id) })
                .toPromise()
                .then((res: any) => {
                  res.forEach((bd: BillDetail) => {
                    this.items.forEach((i: Item) => {
                      if (bd.itemID === i.id) {
                        si.total = si.total + bd.num * i.price;
                        this.renuvalue = this.renuvalue + bd.num * i.price
                      }
                    });
                  });
                });
            }
          });
        }
      }
    });
  }

  exportStaff(){
    let start:string  = this.api.dateTransform(this.startDate?.toString() || '').split(" ")[0];
    let end:string = this.api.dateTransform(this.endDate?.toString() || '').split(" ")[0];
    let fileName = "bao_cao_nhan_su_"+start+"_"+end;
    let exportData:Array<any> = this.staffs.map((si:StaffInfor)=>{
      return {
        "Mã":si.id,
        "Mã cửa hàng":si.shopID,
        "Tên":si.name,
        "Trạng thái":si.status,
        "Tổng DT":si.total.toString() + "đ"
      }
    });
    this.api.exportExcel(fileName,exportData,'data');
  }
}
