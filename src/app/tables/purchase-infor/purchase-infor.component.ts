import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-purchase-infor',
  templateUrl: './purchase-infor.component.html',
  styleUrls: ['./purchase-infor.component.css']
})
export class PurchaseInforComponent implements OnInit {
  @Input() data:any;

  total:number = 0;
  listDetailLU:Array<any> = [];

  constructor() { }

  ngOnInit(): void {
    console.log(this.data);
  }

}
