import { Component, OnInit } from '@angular/core';
import { ApiService } from '../Service/api.service';

@Component({
  selector: 'app-barista',
  templateUrl: './barista.component.html',
  styleUrls: ['./barista.component.css'],
})
export class BaristaComponent implements OnInit {
  ws: WebSocket;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
  }
  testWS(){
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
}
