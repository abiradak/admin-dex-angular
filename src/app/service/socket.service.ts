import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: any;
  // readonly uri = 'http://localhost:3000';
  // readonly uri = 'http://143.110.178.216:3000';
  readonly uri = 'https://151.101.1.195';
  
  constructor() {
    this.socket = io(this.uri, {transports: ['websocket']});
  }
  /**
   * listen
   */
  public listen(eventName: any) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      });
    });
  }

  /**
   * emit
   */
  public emit(eventName: any, data: any) {
    this.socket.emit(eventName, data);
  }
}
