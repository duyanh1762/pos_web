import { Component, OnInit, ViewChild } from '@angular/core';
import { DataRequest } from 'src/app/Interface/data_request';
import { BillDetail } from 'src/app/Models/bill_detail';
import { Item } from 'src/app/Models/item';
import { Shop } from 'src/app/Models/shop';
import { ApiService } from 'src/app/Service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Bill } from 'src/app/Models/bill';
import { Staff } from 'src/app/Models/staff';
import { Group } from 'src/app/Models/group';
interface CartItem {
  id: number;
  itemID: number;
  num: number;
  billID: number;
  policyID: number;
  name: string;
  price: number;
}
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  public shop: Shop;
  public staff: Staff;
  public menu: Array<Item> = [];
  public menuLU : Array<Item> = [];
  public cart: Array<CartItem> = [];
  public sum = 0;
  public type: string = 'new';
  public tableData: Bill;
  public groups:Array<Group> = [];
  constructor(
    private api: ApiService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }
  async load() {
    this.shop = JSON.parse(localStorage.getItem('shop-infor') || '{}');
    this.staff = JSON.parse(localStorage.getItem('staff-infor') || '{}');
    let request: DataRequest = {
      mode: 'get',
      data: '',
    };
    await this.api.group(request).toPromise().then((res:any)=>{
      this.groups = res;
    });
    await this.api
      .item(request)
      .toPromise()
      .then((items: any) => {
        items.forEach((item: any) => {
          item as Item;
          if (item.policyID === this.shop.policyID) {
            this.menu.push(item);
            this.menuLU.push(item);
          }
        });
      });
    this.activeRoute.paramMap.subscribe((data) => {
      let t = data.get('table');
      this.api.bill(request).subscribe((res: any) => {
        res.forEach((bill: Bill) => {
          if (
            bill.table == t &&
            this.api.getCurrentDate() == this.api.billDate(bill) &&
            bill.status == 'not_pay' &&
            bill.shopID == this.shop.id
          ) {
            this.tableData = bill;
            this.type = 'edit';
            this.api.details(request).subscribe((details: any) => {
              details.forEach(async (detail: BillDetail) => {
                if (detail.billID === bill.id) {
                  let name = '';
                  let price = 0;
                  await this.api.getNameItem(detail.itemID).then((data) => {
                    name = data;
                  });
                  await this.api.getPriceItem(detail.itemID).then((data) => {
                    price = data;
                  });
                  let cartItem = {
                    id: detail.id,
                    itemID: detail.itemID,
                    num: detail.num,
                    billID: detail.billID,
                    policyID: this.shop.policyID,
                    name: name,
                    price: price,
                  };
                  (<HTMLElement>(
                    document.querySelector(`.item${detail.itemID} button`)
                  )).style.display = 'none';
                  this.cart.push(cartItem);
                  this.sum = this.getMoneyCart();
                }
              });
            });
          }
        });
      });
    });
  }
  addCart(item: Item) {
    let shop: Shop = JSON.parse(localStorage.getItem('shop-infor') || '{}');
    (<HTMLElement>(
      document.querySelector(`.item${item.id} button`)
    )).style.display = 'none';
    let check:boolean = false;
    let newCartI: CartItem = {
      id: 0,
      itemID: item.id,
      num: 1,
      billID: 1,
      policyID: this.shop.policyID,
      name: item.name,
      price: item.price,
    };
    for(let i = 0 ;i<this.cart.length;i++){
      if((this.cart)[i].itemID === newCartI.itemID){
        (this.cart)[i].num = 1;
        check = true;
        break;
      }
    }
    if(!check){
      this.cart.push(newCartI);
    }
    this.sum = this.getMoneyCart();
  }
  getMoneyCart(): number {
    let money: number = 0;
    this.cart.forEach((item: any) => {
      item as CartItem;
      money = money + item.price * item.num;
    });
    return money;
  }
  plus(item: CartItem) {
    this.cart.forEach((i: any) => {
      i as CartItem;
      if (i.itemID === item.itemID) {
        i.num = i.num + 1;
      }
    });
    this.sum = this.getMoneyCart();
  }
  minus(item: CartItem) {
    this.cart.forEach((i: any) => {
      i as CartItem;
      if (i.itemID === item.itemID) {
        if (i.num <= 1) {
          i.num = 0;
          (<HTMLElement>(
            document.querySelector(`.item${item.itemID} button`)
          )).style.display = 'block';
        } else {
          i.num = i.num - 1;
        }
      }
    });
    this.sum = this.getMoneyCart();
  }
  delete(item: CartItem) {
    this.cart.forEach((i: any) => {
      i as CartItem;
      if (item.itemID === i.itemID) {
        i.num = 0;
        (<HTMLElement>(
          document.querySelector(`.item${item.itemID} button`)
        )).style.display = 'block';
      }
    });

    this.sum = this.getMoneyCart();
  }
  async saveNew() {
    let cartCondition: Array<CartItem> = this.cart.filter((ct: CartItem) => {
      return ct.num > 0;
    });
    if (cartCondition.length <= 0) {
      alert(
        'Không thể lưu hoá đơn không có vật phẩm. Hãy chọn ít nhất 1 món để lưu !'
      );
    } else {
      this.activeRoute.paramMap.subscribe((data) => {
        let t = data.get('table');
        let bill: Bill = {
          id: 0,
          date: this.api.getCurrentDateTime(),
          table: t,
          staffID: this.staff.id,
          shopID: this.shop.id,
          status: 'not_pay',
          policyID: this.shop.policyID,
        };
        this.api
          .bill({ mode: 'create', data: bill })
          .subscribe((response: any) => {
            response as Bill;
            this.cart.forEach((i) => {
              if (i.num > 0) {
                let detail: BillDetail = {
                  id: 0,
                  itemID: i.itemID,
                  num: i.num,
                  billID: response.id,
                  policyID: this.shop.policyID,
                };
                this.api
                  .details({ mode: 'create', data: detail })
                  .subscribe((response) => {});
              }
            });
            this.cart.splice(0, this.cart.length);
            this.sum = 0;
            this.router.navigate(['/tables']);
          });
      });
    }
  }
  async saveEdit() {
    let cartCondition: Array<CartItem> = this.cart.filter((ct: CartItem) => {
      return ct.num > 0;
    });
    if (cartCondition.length <= 0) {
      if (confirm('Bạn có chắc chắn muốn huỷ đơn này ?')) {
        this.tableData.status = 'delete';
        this.api
          .bill({ mode: 'update', data: this.tableData })
          .subscribe((res) => {});
      }
    } else {
      this.cart.forEach((i: CartItem) => {
        if (i.id === 0) {
          if(i.num > 0){
            let newDetail: BillDetail = {
              id: 0,
              itemID: i.itemID,
              num: i.num,
              billID: this.tableData.id,
              policyID: i.policyID,
            };
            this.api
              .details({ mode: 'create', data: newDetail })
              .subscribe((res) => {});
          }
        } else {
          if (i.num > 0) {
            let detail: BillDetail = {
              id: i.id,
              itemID: i.itemID,
              num: i.num,
              billID: i.billID,
              policyID: i.policyID,
            };
            this.api
              .details({ mode: 'update', data: detail })
              .subscribe((res) => {});
          } else {
            let detail: BillDetail = {
              id: i.id,
              itemID: i.itemID,
              num: i.num,
              billID: i.billID,
              policyID: i.policyID,
            };
            this.api
              .details({ mode: 'delete', data: detail })
              .subscribe((res) => {});
          }
        }
      });
    }
    this.cart.splice(0, this.cart.length);
    this.sum = 0;
    this.router.navigate(['/tables']);
  }
  getItem(idG:number){
    this.menu = [];
    this.menuLU.forEach((i:Item)=>{
      if(i.groupID === idG){
        this.menu.push(i);
      }
    });
  }
  getAllMenu(){
    console.log(this.menuLU);
    this.menu = this.menuLU;
  }
}
