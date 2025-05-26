import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DetailGoodsComponent } from './detail-goods/detail-goods.component';
import { Shop } from 'src/app/shared/Models/shop';
import { Staff } from 'src/app/shared/Models/staff';
import { Spend } from 'src/app/shared/Models/spend';
import { Item } from 'src/app/shared/Models/item';
import { Goods } from 'src/app/shared/Models/goods';
import { ApiService } from 'src/app/core/Service/api.service';
import { DataRequest } from 'src/app/shared/Interface/data_request';
import { BillDetail } from 'src/app/shared/Models/bill_detail';
import { IeBill } from 'src/app/shared/Models/ie_bill';
import { IeDetail } from 'src/app/shared/Models/ie_detail';
import { ReceiptFormComponent } from '../../../income/receipt-form/receipt-form.component';

interface IeInfor {
  id: number;
  createAt: string;
  confirmAt: string;
  staffID: number;
  shopID: number;
  status: string;
  type: string; // import || export
  total: number;
}

@Component({
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.css'],
})
export class ProfitLossComponent implements OnInit {
  startDate: Date | null = null;
  endDate: Date | null = null;
  shop: Shop;
  staff: Staff;
  revenue: number = 0;
  spend: number = 0;
  listSpend: Array<Spend> = [];
  items: Array<Item> = [];
  export: boolean = false;
  goodsValue: number = 0;
  ieBills: Array<IeInfor> = [];
  goods: Array<Goods> = [];
  staffs: Array<Staff> = [];

  constructor(private api: ApiService, private bsService: BsModalService) {}

  ngOnInit(): void {
    this.load();
  }
  async load() {
    let request: DataRequest = {
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
      .goods(request)
      .toPromise()
      .then((res: any) => {
        this.goods = res;
      });
    await this.api
      .staff(request)
      .toPromise()
      .then((res: any) => {
        this.staffs = res;
      });
    this.shop = JSON.parse(localStorage.getItem('shop-infor') || '{}');
    this.staff = JSON.parse(localStorage.getItem('staff-infor') || '{}');
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

  async confirmdDate() {
    this.spend = 0;
    this.revenue = 0;
    this.goodsValue = 0;
    this.listSpend = [];
    this.ieBills = [];
    if (this.startDate != null && this.endDate != null) {
      let request: DataRequest = {
        mode: 'get',
        data: '',
      };
      await this.api
        .bill(request)
        .toPromise()
        .then(async (resB: any) => {
          for (let b of resB) {
            let bDate = new Date(b.date);
            if (
              b.status === 'pay' &&
              b.shopID === this.shop.id &&
              bDate >= this.startDate! &&
              bDate <= this.endDate!
            ) {
              await this.api
                .details({ mode: 'get', data: Number(b.id) })
                .toPromise()
                .then((resD: any) => {
                  resD.forEach((d: BillDetail) => {
                    this.items.forEach((i: Item) => {
                      if (d.itemID === i.id) {
                        this.revenue = this.revenue + d.num * i.price;
                      }
                    });
                  });
                });
            }
          }
        });
      await this.api
        .spend(request)
        .toPromise()
        .then((resS: any) => {
          resS.forEach((s: Spend) => {
            let sDate = new Date(s.date);
            if (
              s.shopID === this.shop.id &&
              s.status === 'Active' &&
              sDate >= this.startDate! &&
              sDate <= this.endDate!
            ) {
              this.spend = this.spend + s.total;
              s.date = this.api.dateTransform(s.date);
              this.listSpend.push(s);
            }
          });
        });
      if (this.listSpend.length > 0) {
        this.export = true;
      }
      let ieRequest: DataRequest = {
        mode: 'get-by-range-shop',
        data: `${this.api.dateGMT(
          this.startDate.toString()
        )},${this.api.dateGMT(this.endDate.toString())},${this.shop.id}`,
      };
      await this.api
        .ieBill(ieRequest)
        .toPromise()
        .then(async (res: any) => {
          let ie: IeBill;
          for (ie of res) {
            if (ie.status === 'confirm' && ie.type === 'export') {
              let total: number = 0;
              await this.api
                .ieDetail({ mode: 'get', data: ie.id })
                .toPromise()
                .then((response: any) => {
                  response.forEach((ied: IeDetail) => {
                    this.goods.forEach((g: Goods) => {
                      if (ied.itemID === g.id) {
                        total = total + ied.num * g.price;
                      }
                    });
                  });
                });
              ie.createAt = this.api.dateTransform(ie.createAt);
              ie.confirmAt = this.api.dateTransform(ie.confirmAt);
              this.ieBills.push({ ...ie, total: total });
              this.goodsValue = this.goodsValue + total;
            }
          }
        });
      // console.log(this.api.dateGMT(this.startDate.toString()) +"-"+ this.api.dateGMT(this.endDate.toString()) );
    } else {
      alert('Hãy chọn khoảng thời gian bạn muốn xem báo cáo !');
    }
  }
  exporSpendtReport() {
    let start: string = this.api
      .dateTransform(this.startDate?.toString() || ' ')
      .split(' ')[0];
    let end: string = this.api
      .dateTransform(this.endDate?.toString() || ' ')
      .split(' ')[0];
    let nameFile: string = 'bao_cao_danh_muc_chi_' + start + '_' + end;
    let exportSpend: Array<any> = this.listSpend.map((sp: Spend) => {
      return {
        'Mã danh mục': sp.id,
        Ngày: sp.date.split(' ')[0],
        'Thời gian': sp.date.split(' ')[1],
        'Cửa hàng': this.shop.address,
        'Mô tả': sp.des,
        'Chi phí': sp.total.toString() + 'đ',
      };
    });
    this.api.exportExcel(nameFile, exportSpend, 'data');
  }

  showDetail(id: number) {
    let userCreate: string = '';
    let date:string = "";
    let ieB = this.ieBills.find((ie: IeInfor) => {
      return ie.id === id;
    });
    this.ieBills.forEach((ie:IeInfor)=>{
      if(ie.id === id){
        date = ie.createAt.split(" ")[0];
      }
    });
    this.staffs.forEach((s: Staff) => {
      if (ieB?.staffID === s.id) {
        userCreate = s.name;
      }
    });
    this.bsService.show(ReceiptFormComponent, {
      initialState: {
        data: {
          goods: this.goods,
          id: id,
          date: date,
          staff: userCreate,
        },
      },
    });
  }
  showGoods(){
    this.bsService.show(DetailGoodsComponent,{
      initialState:{
        data:{
          goods:this.goods,
          ieBills:this.ieBills,
        }
      }
    });
  }
}
