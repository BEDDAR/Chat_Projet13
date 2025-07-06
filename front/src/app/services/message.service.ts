import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient: Client;
  public messageStream: Subject<string> = new Subject();

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'), // adapte le port/URL
      reconnectDelay: 5000,
      debug: (str) => console.log('[STOMP]', str),
    });

    this.stompClient.onConnect = () => {
      console.log('WebSocket connecté');
      this.stompClient.subscribe('/topic/messages', (message: IMessage) => {
        this.messageStream.next(message.body);
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Erreur STOMP :', frame);
    };

    this.stompClient.activate(); // obligatoire
  }

  public send(destination: string, body: any): void {
    if (this.stompClient.connected) {
      this.stompClient.publish({
        destination: destination,
        body: JSON.stringify(body),
      });
    } else {
      console.warn('WebSocket non connecté');
    }
  }
}
