import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import * as socketIoClient from 'socket.io-client';

@Injectable()
export class SocketService {
    private io: SocketIOClient.Socket;

    constructor() {
       this.io = socketIoClient.connect('http://localhost:3000');
    }

    public send(eventName: string, payload: any) {
        this.io.emit(eventName, payload);
    }

    public receive<T>(eventName: string): Observable<T> {
        return new Observable((sub: Subscriber<T>) => {
            const eventHandler = (payload: any) => {
                sub.next(payload);
            };
            this.io.on(eventName, eventHandler);

            return () => {
                this.io.removeEventListener(eventName, eventHandler);
            };
        });
    }
}
