import { Iusers } from './../../entities/user/iusers';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class UserService {

  constructor(private http: Http) { }

  getUsers(): Observable<Iusers[]> {
    const url = 'https://api.myjson.com/bins/8pky9';
    return this.http.get(url).map(users => {
      return users.json() as Iusers[];
    });
  }

  getUserLogin(loginForm): Observable<Iusers> {
    const url = 'http://localhost:3000/login';
    return this.http.post(url, loginForm).map(users => {
      if (users.json().person) {
        return users.json().person as Iusers;
      } else {
        return null;
      }
    });
  }

  // getLo(loginForm) {
  //   const url = 'http://localhost:3000/login';
  //   this.http.post(url, loginForm).subscribe(users => {
  //     console.log(users);
  //   });
  // }
}
