import { Component, OnInit } from '@angular/core';
import { Bill } from 'src/app/Models/bill';
import { BillDetail } from 'src/app/Models/bill_detail';
import { Item } from 'src/app/Models/item';
import { Shop } from 'src/app/Models/shop';
import { Staff } from 'src/app/Models/staff';
import { ApiService } from 'src/app/Service/api.service';
interface SatffInfor {
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
  staffs: Array<SatffInfor> = [];
  shop: Shop;
  bills: Array<Bill> = [];
  renuvalue:number=0;
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }
  onStartDateChange(event: any): void {
    if (event) {
      this.startDate = new Date(event);
      this.startDate.setHours(0, 0, 0, 0); // Thiết lập thời gian 00:00:00
    }
  }

  onEndDateChange(event: any): void {
    if (event) {
      this.endDate = new Date(event);
      this.endDate.setHours(23, 59, 59, 999); // Thiết lập thời gian 23:59:59
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
          if (this.shop.id === s.shopID) {
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
    this.staffs.forEach((si:SatffInfor)=>{
      si.total = 0;
    });
    this.renuvalue = 0;
    this.bills.forEach((b: Bill) => {
      let billDate = new Date(b.date);
      if (this.startDate != null && this.endDate != null) {
        if (billDate >= this.startDate && billDate <= this.endDate) {
          this.staffs.forEach(async (si: SatffInfor) => {
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
}
