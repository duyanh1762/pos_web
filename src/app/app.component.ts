import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from './Service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public api:ApiService, private router:Router){}
  title = 'pos_web';

  closeNav(){
    this.api.nav_open = false;
  }
  navigateTo(path:string){
    this.router.navigate([`${path}`]);
  }
}
