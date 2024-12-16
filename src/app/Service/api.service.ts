import { Injectable } from '@angular/core';
import { LoginReQuest } from '../Interface/login_request';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataRequest } from '../Interface/data_request';
import { Bill } from '../Models/bill';
import { Item } from '../Models/item';
import * as xlsx from 'xlsx';
import * as fs from 'file-saver';
import { io } from 'socket.io-client';
import { Staff } from '../Models/staff';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  server: string = 'http://localhost:3000/';
  constructor(private http: HttpClient) {
    // this.connect();
  }

  public login(request: LoginReQuest) {
    return this.http.post(this.server + 'login-authen', request);
  }
  public staff(request: DataRequest) {
    return this.http.post(this.server + 'staff', request);
  }
  public bill(request: DataRequest) {
    return this.http.post(this.server + 'bill', request);
  }
  public details(request: DataRequest) {
    return this.http.post(this.server + 'bill-detail', request);
  }
  public item(request: DataRequest) {
    return this.http.post(this.server + 'item', request);
  }
  public group(request: DataRequest) {
    return this.http.post(this.server + 'group', request);
  }
  public spend(request: any) {
    return this.http.post(this.server + 'spend', request);
  }
  public getQr(request: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = {
      headers: headers,
      responseType: 'text' as 'json',
    };
    // return this.http.post(this.server + 'qr', request , options); // gui request co kieu du lieu la application/json , nhan response co kieu du lieu text
    return this.http.post(this.server + 'qr/get', request, {
      responseType: 'text',
    });
  }
  getCurrentDate(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }
  billDate(bill: Bill): string {
    const date = new Date(bill.date);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${year}-${month}-${day}`;
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
  dateTransform(dateTime: string) {
    const date = new Date(dateTime);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return `${formattedDate} ${formattedTime}`;
  }

  async getNameItem(id: number): Promise<string> {
    let request: DataRequest = {
      mode: 'get',
      data: '',
    };
    let name: string = '';
    await this.item(request)
      .toPromise()
      .then((items: any) => {
        items.forEach((item: Item) => {
          if (item.id === id) {
            name = item.name;
          }
        });
      });
    return name;
  }
  async getPriceItem(id: number): Promise<number> {
    let request: DataRequest = {
      mode: 'get',
      data: '',
    };
    let price: number = 0;
    await this.item(request)
      .toPromise()
      .then((items: any) => {
        items.forEach((item: Item) => {
          if (item.id === id) {
            price = item.price;
          }
        });
      });
    return price;
  }

  async getStaffName(idS: number): Promise<string> {
    let name: string = '';
    let request: DataRequest = {
      mode: 'get',
      data: '',
    };
    await this.staff(request)
      .toPromise()
      .then((res: any) => {
        res.forEach((s: Staff) => {
          if (s.id === idS) {
            name = s.name;
          }
        });
      });
    return name;
  }

  exportExcel(fileName: string, dataE: Array<any>, sheetName: string) {
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(dataE);
    const workbook: xlsx.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: [sheetName],
    };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    fs.saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
  }

  //Web socket service test

  // public socket: WebSocket;

  // private connect() {
  //   this.socket = new WebSocket('ws://localhost:56002/ws_order');

  //   this.socket.onopen = () => {
  //     console.log('Connected to WebSocket server');
  //   };

  //   this.socket.onmessage = (event) => {
  //     console.log('Message from server: ', event.data);
  //   };

  //   this.socket.onclose = () => {
  //     console.log('WebSocket connection closed');
  //   };
  // }

  // public sendData(data:any) {
  //   this.socket.send(data);
  // }

  private socket = io('http://localhost:3000'); // URL của WebSocket server (NestJS)

  sendOrder(order: any) {
    this.socket.emit('ws_order', order); // Gửi thông điệp lên server
  }

  onOrderUpdate(callback: (data: any) => void) {
    this.socket.on('orderUpdate', callback); // Lắng nghe các cập nhật từ server
  }
  removeAccents(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
