import { SocketService } from './../../../bank-forder/service-all/services/socket.service';
import { BehaviorService } from './../../../bank-forder/service-all/services/behavior.service';
import { Http } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage/dist/local-storage.service';
import { Iusers } from './../../../bank-forder/entities/user/iusers';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as io from 'socket.io-client';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnDestroy {
  private users: Iusers[];
  private me: Iusers;
  private makeFr: Boolean = false;
  private subscription: Subscription;
  private subscribers: Subscription[] = [];
  constructor(private router: Router,
    private http: Http,
    private localstorage: LocalStorageService,
    private behavior: BehaviorService,
    private socketService: SocketService
  ) {
    this.me = this.localstorage.get('user');
  }

  ngOnInit() {
    this.subscription = this.behavior.getArrUser().subscribe(userArr => {
      this.users = userArr.users as Iusers[];
    });
  }

  ngOnDestroy(): void {
    this.subscribers.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  selectUser(value) {
    this.socketService.send('checkFriend', { id: this.me._id, idFriend: value._id });
    this.subscribers.push(this.socketService.receive<any>('valueCheck').subscribe((wait) => {
      if (wait === 'have a friend') {
        this.makeFr = true;
        this.behavior.sendArrUser(this.makeFr);
      } else {
        this.makeFr = false;
        this.behavior.sendArrUser(this.makeFr);
      }
    }));
    // this.socket.on('valueCheck', wait => {
    //   if (wait === 'have a friend') {
    //     this.makeFr = true;
    //     this.behavior.sendArrUser(this.makeFr);
    //   } else {
    //     this.makeFr = false;
    //     this.behavior.sendArrUser(this.makeFr);
    //   }
    // });
    this.router.navigate(['./chat', value._name, value._id]);
  }

}
