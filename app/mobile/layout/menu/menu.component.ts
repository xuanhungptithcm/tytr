import { BehaviorService } from './../../../bank-forder/service-all/services/behavior.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { Iusers } from '../../../bank-forder/entities/user/iusers';
import { LocalStorageService } from 'angular-2-local-storage';
import { Http } from '@angular/http';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { SocketService } from '../../../bank-forder/service-all/services';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  private notication: Iusers[] = [];
  private keySearch: string;
  private base64Image: string;
  private Iuser: Iusers;
  private changeClass: Number = 1;
  private role: Boolean = false;
  private users: Iusers[] = [];
  private co = 0;
  private subscribers: Subscription[] = [];
  private search$ = new Subject<string>();

  constructor(
    private router: Router,
    private localstoage: LocalStorageService,
    private http: Http,
    private behavior: BehaviorService,
    private socketService: SocketService
  ) {
    this.Iuser = this.localstoage.get('user');

  }

  ngOnInit() {
    // Thong Bao
    this.socketService.send('notication', { _id: this.Iuser._id });
    this.subscribers.push(this.socketService.receive<any>('responsenotice')
      .subscribe((notice) => {
        this.notication = notice.notice;
      })
    );

    this.subscribers.push(this.socketService.receive<any>('persons').subscribe((persons) => {
      this.behavior.sendArrUser(persons.persons);
    }));

    // if (!this.keySearch) {
    //   this.keySearch = '';
    //   this.findUser(); // chi vo dung 1 lan
    // }
    this.subscribers.push(this.search$ // cu co su kien la no se them vao
      .debounceTime(275)
      .distinctUntilChanged()
      .subscribe((searchTerm) => {
        this.keySearch = searchTerm;
        if (this.keySearch === '') {
          this.keySearch = null;
        }
        this.findUser();
      })
    );
  }

  ngOnDestroy() {
    this.subscribers.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  changeRole(value) {
    if (value === 1) {
      this.findUser();
      this.router.navigate(['./layout/message']);
    } if (value === 2) {
      this.router.navigate(['./layout/activity']);
    } if (value === 3) {
      this.socketService.send('notication', { _id: this.Iuser._id });
      this.router.navigate(['./layout/group']);
    }
    this.changeClass = value;
  }

  changeProfit(event) {
    const file: File = event.target.files[0];
    const myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.base64Image = myReader.result;
      this.http.post('http://localhost:3000/profit', { image: this.base64Image, name: file.name, id: this.Iuser._id }).subscribe(profit => {
        this.Iuser._img = profit.json().image;
        this.localstoage.add('user', this.Iuser);
      });
    };
    myReader.readAsDataURL(file);
  }

  logout() {
    this.role = !this.role;
    this.localstoage.remove('user');
    this.router.navigate(['./']);
  }

  closeRole() {
    this.role = !this.role;
  }

  findUser() {
    this.socketService.send('find', {
      search: this.keySearch,
      _id: this.Iuser._id
    });
  }

  searchHandler(event) {
    this.search$.next(event.target.value);
  }

  changeText() {
    if (!this.keySearch) {
      console.log('alo');
      this.findUser();
    }
  }
}
