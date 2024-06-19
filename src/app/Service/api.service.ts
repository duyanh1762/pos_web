import { Injectable } from '@angular/core';
import { LoginReQuest } from '../Interface/login_request';
import { HttpClient } from '@angular/common/http';
import { DataRequest } from '../Interface/data_request';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  server:string = "http://localhost:3000/";
  constructor(private http:HttpClient) { }

  public login(request:LoginReQuest){
    return this.http.post(this.server+"login-authen",request);
  }
  public getStaff(request:DataRequest){
    return this.http.post(this.server+"staff",request);
  }
}
