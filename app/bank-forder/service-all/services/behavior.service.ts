import { Subscription } from 'rxjs/Subscription';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BehaviorService {
  private subject = new Subject<any>();
  private subscription: Subscription;
  constructor() { }

  sendArrUser(userArr) {
    this.subject.next({users: userArr});
  }

  clearArrUser() {
    this.subject.next(); // xóa nhưng không được
  }

  getArrUser(): Observable<any> {
    return this.subject.asObservable();
  }
}
