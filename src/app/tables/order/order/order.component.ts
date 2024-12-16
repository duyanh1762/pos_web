import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataRequest } from 'src/app/Interface/data_request';
import { BillDetail } from 'src/app/Models/bill_detail';
import { Item } from 'src/app/Models/item';
import { Shop } from 'src/app/Models/shop';
import { ApiService } from 'src/app/Service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Bill } from 'src/app/Models/bill';
import { Staff } from 'src/app/Models/staff';
import { Group } from 'src/app/Models/group';
import { Renderer2 } from '@angular/core';

interface CartItem {
  id: number;
  itemID: number;
  num: number;
  billID: number;
  policyID: number;
  name: string;
  price: number;
}

interface mItem {
  id: number;
  policyID: number;
  name: string;
  price: number;
  groupID: number;
  status: string; // order | not_order
}

interface ItemOrder{
  id: number;
  itemID:number;
  num: number,
  billID: number;
  name:string;
  table:string | undefined;
  status:string; // confirm | not_confirm
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit{
  @ViewChild("searchInput",{read:ElementRef,static:true}) searchInput:ElementRef;

  public shop: Shop;
  public staff: Staff;
  public menu: Array<mItem> = [];
  public menuLU: Array<mItem> = [];
  public cart: Array<CartItem> = [];
  public cartLU:Array<CartItem> = [];
  public sum = 0;
  public type: string = 'new';
  public tableData: Bill;
  public groups: Array<Group> = [];

  // ws: WebSocket;

  constructor(
    private api: ApiService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2
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
    await this.api
      .group(request)
      .toPromise()
      .then((res: any) => {
        this.groups = res.filter((g:Group)=>{
          return g.name.indexOf("_ff") === -1;
        });
      });
    await this.api
      .item(request)
      .toPromise()
      .then((items: any) => {
        items.forEach((item: any) => {
          item as Item;
          let mItem: mItem = {
            ...item,
            status: 'not_order',
          };
          if (mItem.policyID === this.shop.policyID) {
            this.menu.push(mItem);
            this.menuLU.push(mItem);
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
                  this.menu.forEach((i:mItem)=>{
                    if(i.id === detail.itemID){
                      i.status = "order";
                    }
                  });
                  this.menuLU = this.menu;
                  this.cart.push(cartItem);
                  this.cartLU.push({...cartItem});
                  this.sum = this.getMoneyCart();
                }
              });
            });
          }
        });
      });
    });
  }

  addCart(item: mItem) {
    let shop: Shop = JSON.parse(localStorage.getItem('shop-infor') || '{}');
    this.menuLU.forEach((iLU: mItem) => {
      if (item.id === iLU.id) {
        iLU.status = "order";
      }
    });
    this.menu.forEach((iM:mItem)=>{
      this.menuLU.forEach((iLU:mItem)=>{
        if(iM.id === iLU.id){
          iM.status = iLU.status;
        }
      });
    });
    let check: boolean = false;
    let newCartI: CartItem = {
      id: 0,
      itemID: item.id,
      num: 1,
      billID: 1,
      policyID: this.shop.policyID,
      name: item.name,
      price: item.price,
    };
    for (let i = 0; i < this.cart.length; i++) {
      if (this.cart[i].itemID === newCartI.itemID) {
        this.cart[i].num = 1;
        check = true;
        break;
      }
    }
    if (!check) {
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
          this.changeStatus(item,"not_order");
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
        this.changeStatus(item,"not_order");
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
            this.cart.forEach((i:CartItem) => {
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
                  .subscribe((res:any) => {
                    let newOrder:ItemOrder = {
                      id: res.id,
                      itemID: i.itemID,
                      num: i.num,
                      billID: response.id,
                      name:i.name,
                      table:response.table,
                      status:"not_confirm"
                    };
                    this.api.sendOrder(newOrder);
                  });
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
        this.cartLU.forEach((i:CartItem)=>{
          let newOrder:ItemOrder = {
            id: i.id,
            itemID: i.itemID,
            num: i.num,
            billID: this.tableData.id,
            name:i.name + " (Huỷ)",
            table:this.tableData.table?.toString(),
            status:"not_confirm"
          };
          this.api.sendOrder(newOrder);
        });
      }
    } else {
      this.cart.forEach((i: CartItem) => {
        if (i.id === 0) {
          if (i.num > 0) {
            let newDetail: BillDetail = {
              id: 0,
              itemID: i.itemID,
              num: i.num,
              billID: this.tableData.id,
              policyID: i.policyID,
            };
            this.api
              .details({ mode: 'create', data: newDetail })
              .subscribe((res:any) => {
                let newOrder:ItemOrder = {
                  id: res.id,
                  itemID: i.itemID,
                  num: i.num,
                  billID: this.tableData.id,
                  name:i.name,
                  table:this.tableData.table?.toString(),
                  status:"not_confirm"
                };
                this.api.sendOrder(newOrder);
              });
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
          this.cartLU.forEach((iLU:CartItem)=>{
            if(iLU.id === i.id){
              let n:number = i.num - iLU.num;
              if(n > 0){
                let newOrder:ItemOrder = {
                  id: i.id,
                  itemID: i.itemID,
                  num: n,
                  billID: this.tableData.id,
                  name:i.name,
                  table:this.tableData.table?.toString(),
                  status:"not_confirm"
                };
                this.api.sendOrder(newOrder);
              }else if(n < 0){
                let newOrder:ItemOrder = {
                  id: i.id,
                  itemID: i.itemID,
                  num: n,
                  billID: this.tableData.id,
                  name:i.name + " (Huỷ)",
                  table:this.tableData.table?.toString(),
                  status:"not_confirm"
                };
                this.api.sendOrder(newOrder);
              }
            }
          });
        }
      });
    }
    this.cart.splice(0, this.cart.length);
    this.sum = 0;
    this.router.navigate(['/tables']);
  }

  getItem(idG: number) {
    this.menu = [];
    this.menuLU.forEach((i: mItem) => {
      if (i.groupID === idG) {
        this.menu.push(i);
      }
    });
  }

  getAllMenu() {
    this.menu = [];
    this.menuLU.forEach((i:mItem)=>{
      this.menu.push(i);
    });
  }

  changeStatus(obj:CartItem , status:string){
    this.menuLU.forEach((i:mItem)=>{
      if(obj.itemID === i.id ){
        i.status = status;
      }
      this.menu.forEach((item:mItem)=>{
        if(item.id === i.id){
          item.status = i.status;
        }
      });
    });
  }
  searchItem(){
    let searchValue:string = this.searchInput.nativeElement.value;
    this.menu = [];
    if(searchValue.length <= 0){
      this.getAllMenu();
    }else{
      this.menuLU.forEach((i:mItem)=>{
        if(this.api.removeAccents(i.name.toLowerCase()).indexOf(this.api.removeAccents(searchValue.toLowerCase())) != -1){
          this.menu.push(i);
        }
      });
    }
  }
}
