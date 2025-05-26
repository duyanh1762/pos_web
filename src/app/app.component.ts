import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './core/Service/api.service';

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
