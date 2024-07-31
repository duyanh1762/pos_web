import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-bill',
  templateUrl: './report-bill.component.html',
  styleUrls: ['./report-bill.component.css']
})
export class ReportBillComponent implements OnInit {
  startDate: Date | null = null;
  endDate: Date | null = null;
  constructor() { }

  ngOnInit(): void {
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
  confirmDate(){}

}
