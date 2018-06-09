import { Injectable } from '@angular/core';
import {Headers, Http} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import {environment} from "../../environments/environment";

@Injectable()
export class SearchService {
  baseUrl: string = 'https://api.cdnjs.com/libraries';
  queryUrl: string = '?search=';

  constructor(private http: Http) { }

  search(terms: Observable<string>) {
    return terms.debounceTime(400)
      .distinctUntilChanged()
      .switchMap(term => this.searchEntries2(term));
  }

  private query = {
    searchKey:String
  }

  searchEntries(term='null') {
    return this.http
      .get(this.baseUrl + this.queryUrl + term)
      .map(res => res.json());
  }

  searchEntries2(term) {

    let headers = new Headers();
    headers.append('Content-type','application/json');

    return this.http.get(`${environment.baseUrl}/product/search/${term}`,{headers:headers})
      .map(res => res.json());
  }
}
