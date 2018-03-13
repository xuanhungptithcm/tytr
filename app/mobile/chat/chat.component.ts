import { FormControl } from '@angular/forms';
import { SocketService } from './../../bank-forder/service-all/services/socket.service';
import { Subscription } from 'rxjs/Subscription';
import { LocalStorageService } from 'angular-2-local-storage/dist/local-storage.service';
import { element } from 'protractor';
import { BehaviorService } from './../../bank-forder/service-all/services/behavior.service';
import { Iusers } from './../../bank-forder/entities/user/iusers';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  private me: Iusers;
  private yourshelf: Iusers = {};
  private idFriend: String = '';
  private nameUser: String = '';
  private makeFr: Number = 0;
  private subscription: Subscription[] = [];
  private message = new FormControl();
  private messagefriend: String;
  private messageMe: String;
  constructor(private activeRouter: ActivatedRoute,
    private behavior: BehaviorService,
    private localstorage: LocalStorageService,
    private router: Router,
    private socketService: SocketService
  ) {

    this.activeRouter.params.subscribe(param => {
      this.idFriend = param.id;
      this.nameUser = param.name;
    });

    this.me = this.localstorage.get('user');

  }

  ngOnInit() {
    // this.socket.emit('checkFriend', { id: this.me._id, idFriend: this.idFriend });
    // this.socket.on('valueCheck', wait => {
    //   console.log(wait);
    //   if (wait === 'have a friend') {
    //     this.makeFr = true;
    //   } else {
    //     this.makeFr = false;
    //   }
    // });
    this.socketService.send('checkFriend', { id: this.me._id, idFriend: this.idFriend });
    this.subscription.push(this.socketService.receive<any>('valueCheck').subscribe(wait => {
      console.log(wait);
      if (wait === 'have a friend') {
        this.makeFr = 1;
      }
    }));

    this.socketService.send('reponseFriend', { id: this.me._id, idFriend: this.idFriend });
    this.subscription.push(this.socketService.receive<any>('waityou').subscribe(wait => {
      if (wait) {
        this.makeFr = 2;
      }
    }));


    this.socketService.send('reponseFriend2', { id: this.me._id, idFriend: this.idFriend });
    this.subscription.push(this.socketService.receive<any>('waityou2').subscribe(wait => {
      if (wait) {
        this.makeFr = 2;
      }
    }));

    this.subscription.push(this.socketService.receive<any>('messageResponse').subscribe(message => {
      console.log(message);
      this.messagefriend = message;
    }));

  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => {
      sub.unsubscribe();
    });
  }


  makeFriend() {
    this.socketService.send('makeF', { id: this.me._id, idFriend: this.idFriend });
    this.makeFr = 1;
  }

  cancleFriend() {

  }
  // back() {
  //   this.router.navigate(['./layout/message']);
  // }

  sendMessage() {
    this.messageMe = this.message.value;
    this.socketService.send('message', {message: this.message.value, idFriend: this.idFriend});
    this.message.setValue('');
  }
}
