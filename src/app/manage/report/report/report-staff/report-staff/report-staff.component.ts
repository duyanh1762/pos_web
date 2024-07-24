import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-staff',
  templateUrl: './report-staff.component.html',
  styleUrls: ['./report-staff.component.css']
})
export class ReportStaffComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  startDate: Date | null = null;
  endDate: Date | null = null;

  handleDateChange(event: any) {
    const date = event.value;
    const formattedDate = this.formatDate(date);
    console.log('Selected date:', formattedDate);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  getTimeLine(){
    console.log("Ngay bat dau: "+ this.startDate);
    console.log("Ngay ket thuc: "+ this.endDate);
  }
}
