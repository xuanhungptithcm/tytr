import { LocalStorageService } from 'angular-2-local-storage/dist/local-storage.service';
import { Iusers } from './../../../bank-forder/entities/user/iusers';
import { SocketService } from './../../../bank-forder/service-all/services/socket.service';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit, OnDestroy {
  private subscribers: Subscription[] = [];
  private notication: Iusers[] = [];
  private me: Iusers;
  constructor(private socketService: SocketService,
    private localstorage: LocalStorageService) {
    this.me = this.localstorage.get('user');
  }

  ngOnInit() {
    this.subscribers.push(this.socketService.receive<any>('responsenotice')
      .subscribe((notice) => {
        this.notication = notice.notice;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(sub => {
      sub.unsubscribe();
    });
  }

  cancleAccept(id) {
    this.socketService.send('cancleAccpet', { id: this.me._id, idFriend: id });
  }

  accept(id) {
    this.socketService.send('accpet', { id: this.me._id, idFriend: id });
  }
}
