import { Component, OnInit } from '@angular/core';
import { ApiService } from '../Service/api.service';
interface ItemOrder {
  id: number;
  itemID: number;
  num: number;
  billID: number;
  name: string;
  table: string;
  shopID: number;
  note: string;
  status: string; // confirm | not_confirm
}
@Component({
  selector: 'app-barista',
  templateUrl: './barista.component.html',
  styleUrls: ['./barista.component.css'],
})
export class BaristaComponent implements OnInit {
  ws: WebSocket;
  itemsOrder: Array<ItemOrder> = [];
  itemsOrderLU: Array<ItemOrder> = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadWS();
  }

  loadWS() {
    let shopID: number = JSON.parse(
      localStorage.getItem('shop-infor') || '{}'
    ).id;
    if (localStorage.getItem('order_item')) {
      this.itemsOrderLU = JSON.parse(
        localStorage.getItem('order_item') || '[]'
      );
      this.api.onOrderUpdate((data: ItemOrder) => {
        let checked: boolean = true;
        if (data.shopID === shopID) {
          this.itemsOrderLU.forEach((i: ItemOrder) => {
            if (i.id === data.id && i.name != data.name && i.status ==="not_confirm") {
              let index: number = this.itemsOrderLU.indexOf(i);
              let newNum: number = i.num - Math.abs(data.num);
              if (newNum <= 0) {
                this.itemsOrderLU[index].name = data.name;
                checked = false;
              } else {
                this.itemsOrderLU[index].num = newNum;
                checked = false;
              }
            } else if (i.id === data.id && i.name === data.name && i.status ==="not_confirm") {
              let index: number = this.itemsOrderLU.indexOf(i);
              let newNum: number = i.num + data.num;
              this.itemsOrderLU[index].num = newNum;
              // this.itemsOrderLU.push(data);
              checked = false;
            }
          });
          if (checked === true) {
            this.itemsOrderLU.push(data);
          }
          localStorage.setItem('order_item', JSON.stringify(this.itemsOrderLU));
          this.itemsOrder = this.itemsOrderLU.filter((i: ItemOrder) => {
            return i.status === 'not_confirm';
          });
        }
      });
    } else {
      localStorage.setItem('order_item', JSON.stringify([]));
      this.loadWS();
    }
  }

  testWS() {
    // Kết nối WebSocket
    this.ws = new WebSocket('ws://localhost:56001');

    // Lắng nghe tin nhắn từ server (đơn hàng từ thu ngân)
    this.ws.onmessage = (event: MessageEvent) => {
      console.log(event.data);
      if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result; // Lấy giá trị từ Blob
          // Kiểm tra xem text có phải là chuỗi không
          if (typeof text === 'string') {
            try {
              const messageData = JSON.parse(text); // Phân tích chuỗi thành đối tượng
              console.log(messageData); // Xử lý đối tượng JSON
            } catch (error) {
              console.error('Error parsing JSON: ', error);
            }
          } else {
            console.error('Received data is not a valid string.');
          }
        };
        reader.readAsText(event.data); // Đọc Blob thành chuỗi
      } else {
        // Nếu dữ liệu không phải là Blob
        try {
          const messageData = JSON.parse(event.data);
          console.log(messageData); // Xử lý đối tượng JSON
        } catch (error) {
          console.error('Error parsing JSON: ', error);
        }
      }
    };
  }

  confirm(item: ItemOrder) {
    this.itemsOrderLU.forEach((i: ItemOrder) => {
      if (item.id === i.id) {
        i.status = 'confirm';
      }
    });
    localStorage.setItem('order_item', JSON.stringify(this.itemsOrderLU));
    this.itemsOrder = this.itemsOrderLU.filter((i: ItemOrder) => {
      return i.status === 'not_confirm';
    });
  }

  getItems(type: string) {
    this.itemsOrder = [];
    this.itemsOrder = this.itemsOrderLU.filter((item: ItemOrder) => {
      return item.status === type;
    });
  }

  resetStorage() {
    localStorage.removeItem('order_item');
  }
}
