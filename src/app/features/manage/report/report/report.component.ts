import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/Service/api.service';

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
