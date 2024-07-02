import { Component, OnInit, ViewChild } from '@angular/core';
import { DataRequest } from 'src/app/Interface/data_request';
import { BillDetail } from 'src/app/Models/bill_detail';
import { Item } from 'src/app/Models/item';
import { Shop } from 'src/app/Models/shop';
import { ApiService } from 'src/app/Service/api.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { Bill } from 'src/app/Models/bill';
import { Staff } from 'src/app/Models/staff';
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
  public staff:Staff;
  public menu: Array<Item> = [];
  public cart: Array<CartItem> = [];
  public sum = 0;
  constructor(private api: ApiService, private activeRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.load();
  }
  async load() {
    this.shop = JSON.parse(localStorage.getItem('shop-infor') || '{}');
    this.staff = JSON.parse(localStorage.getItem('staff-infor') || '{}')
    let request: DataRequest = {
      mode: 'get',
      data: '',
    };
    await this.api
      .getItems(request)
      .toPromise()
      .then((items: any) => {
        items.forEach((item: any) => {
          item as Item;
          if (item.policyID === this.shop.policyID) {
            this.menu.push(item);
          }
        });
      });
  }
  addCart(item: Item) {
    let shop: Shop = JSON.parse(localStorage.getItem('shop-infor') || '{}');
    (<HTMLElement>(
      document.querySelector(`.item${item.id} button`)
    )).style.display = 'none';
    let newCartI: CartItem = {
      id: 0,
      itemID: item.id,
      num: 1,
      billID: 1,
      policyID: this.shop.policyID,
      name: item.name,
      price: item.price,
    };
    this.cart.push(newCartI);
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
          const indexR = this.cart.findIndex((r) => {
            r === i;
          });
          this.cart.splice(indexR, 1);
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
        const indexR = this.cart.findIndex((r) => {
          r === i;
        });
        this.cart.splice(indexR, 1);
        (<HTMLElement>(
          document.querySelector(`.item${item.itemID} button`)
        )).style.display = 'block';
      }
    });
    this.sum = this.getMoneyCart();
  }
  async save() {
    this.activeRoute.paramMap.subscribe((data)=>{
      let t = data.get("table") ;
      let bill:Bill = {
        id: 0,
        date:this.getCurrentDateTime(),
        table: t,
        staffID: this.staff.id,
        shopID:this.shop.id,
        status:'not_pay',
        policyID:this.shop.policyID,
      }
      this.api.getBill({mode:"create",data:bill}).subscribe((response)=>{
        console.log(response);
        //.... sau khi lay duoc id bill thi lap qua cart de them chi tiet hoa don vao db
        // ... to do here ....
      })
    });
  }
  getCurrentDateTime(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
