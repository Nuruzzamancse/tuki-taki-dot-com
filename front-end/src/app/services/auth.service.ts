import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import { HttpClientModule} from "@angular/common/http";
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { environment} from "../../environments/environment";


@Injectable()
export class AuthService {

  authToken: any;
  user: any;

  constructor(private http:Http) { }

  registerUser(user){

    let headers = new Headers();

    headers.append('Content-type','application/json');

    return this.http.post(`${environment.baseUrl}/user`,user,{headers: headers})
      .map(res => res.json())
  }


  // authenticateUser(user){
  //
  //   let headers = new Headers();
  //   headers.append('Content-type','application/json');
  //   return this.http.post('http://localhost:3000/authenticate' ,user ,{headers:headers})
  //     .map( res => res.json());
  //
  // }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-type','application/json');

    return this.http.post(`${environment.baseUrl}/auth/login`,user,{headers: headers})
      .map( res => res.json());
  }


  getSiingleProfile(loginId){

    let headers = new Headers();
    this.loadToken();

    headers.append('Content-type','application/json');
    return this.http.get(`${environment.baseUrl}/user/${loginId}` ,{headers:headers})
      .map( res => res.json());

  }

  UpdateProfile(loginId, User){

    let headers = new Headers();
    this.loadToken();

    console.log('In service upadte'+ JSON.stringify(User));

    headers.append('Content-type','application/json');
    return this.http.patch(`${environment.baseUrl}/user/${loginId}` ,User,{headers:headers})
      .map( res => res.json());

  }

  getProfile(){
    let headers = new Headers();

    this.loadToken();

    // console.log('Token '+this.authToken);

    headers.append('authorization',this.authToken);

    headers.append('Content-Type','application/json');

    return this.http.get(`${environment.baseUrl}/user`,{headers:headers})
      .map( res => res.json());
  }



  deleteProfile(id){
    let headers = new Headers();

    this.loadToken();

    console.log('In delete profile');

    // console.log('Token '+this.authToken);

    headers.append('authorization',this.authToken);

    headers.append('Content-Type','application/json');




    return this.http.delete(`${environment.baseUrl}/user/${id}`,{headers:headers})
      .map( res => res.json());
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }


  storeUserDatta(token,user){
    localStorage.setItem('id_token', token);
    localStorage.setItem('user',JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }


  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  loggedIn(){
    return tokenNotExpired('id_token');
  }

}
