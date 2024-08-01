import { ArrayType } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Bill } from 'src/app/Models/bill';
import { Item } from 'src/app/Models/item';
import { Shop } from 'src/app/Models/shop';
import { Staff } from 'src/app/Models/staff';
import { ApiService } from 'src/app/Service/api.service';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  constructor(private api:ApiService) { }

  ngOnInit(): void {
  }
}
