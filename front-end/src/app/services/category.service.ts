import { Injectable } from '@angular/core';
import {Headers, Http} from "@angular/http";
import 'rxjs/add/operator/map';
import { HttpClientModule} from "@angular/common/http";
import { tokenNotExpired } from "angular2-jwt";
import { environment} from "../../environments/environment";

@Injectable()
export class CategoryService {

  authToken: any;
  user: any;

  constructor(private http: Http) { }


  getCategory(){

    let headers = new Headers();
    headers.append('Content-type','application/json');

    return this.http.get(`${environment.baseUrl}/category`,{headers: headers})
      .map(res => res.json())
  }

  deleteCategory(id) {
    let headers = new Headers();

    this.loadToken();

    console.log('In delete category');

    console.log('Category ID: '+ id);

    headers.append('authorization',this.authToken);
    headers.append('Content-Type','application/json');

    return this.http.delete(`${environment.baseUrl}/category/${id}`,{headers:headers})
      .map( res => res.json());

  }

  addCategory(data) {
    // console.log(category);
    let headers = new Headers();

    headers.append('Content-type','application/json');

    return this.http.post(`${environment.baseUrl}/category`,data,{headers: headers})
      .map(res => res.json());
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

}
