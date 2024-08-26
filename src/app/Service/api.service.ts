import { Injectable } from '@angular/core';
import { LoginReQuest } from '../Interface/login_request';
import { HttpClient } from '@angular/common/http';
import { DataRequest } from '../Interface/data_request';
import { Bill } from '../Models/bill';
import { Item } from '../Models/item';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  server: string = 'http://localhost:3000/';
  constructor(private http: HttpClient) {}

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

  async getNameItem(id: number):Promise<string> {
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
  async getPriceItem(id: number):Promise<number> {
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
  dateTransform(dateTime:string){
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
}
