import { LocalStorageService } from 'angular-2-local-storage';
import { SocketService } from './bank-forder/service-all/services/socket.service';
import { Iusers } from './bank-forder/entities/user/iusers';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private me: Iusers;
  constructor(private socket: SocketService,
    private localstorage: LocalStorageService) { }

  ngOnInit() {
    this.me = this.localstorage.get('user');
    this.socket.send('getconnect', { id: this.me._id });
    this.socket.receive<any>('provider').subscribe(res => {
      console.log(res);
    });
  }
}
