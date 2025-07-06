import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatWebsocketService {
  private stompClient!: Client;
  private messageSubject = new Subject<any>();
  private subscriptions: Map<number, () => void> = new Map();

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('✅ WebSocket connecté');
        // Tu peux ici t'abonner directement à des topics par défaut si tu veux
      },
      onStompError: (frame) => {
        console.error('❌ STOMP error', frame);
      }
    });

    this.stompClient.activate();
  }

  /**
   * S'abonner à un topic de messages (par ex: pour un contact donné)
   */
  public subscribeToChat(contactId: number): void {
  if (this.subscriptions.has(contactId)) {
    return; // ✅ déjà abonné à ce contact, ne rien faire
  }

  const subscription = this.stompClient.subscribe(`/topic/chat/${contactId}`, (message: IMessage) => {
    const msg = JSON.parse(message.body);
    this.messageSubject.next(msg);
  });

  // Sauvegarde la fonction de désabonnement
  this.subscriptions.set(contactId, () => subscription.unsubscribe());
}


public unsubscribeFromChat(contactId: number): void {
  const unsubscribe = this.subscriptions.get(contactId);
  if (unsubscribe) {
    unsubscribe();              // 🧹 Désabonne STOMP
    this.subscriptions.delete(contactId); // ❌ Nettoie la Map
  }
}


  /**
   * Permet à tes composants d'écouter les nouveaux messages
   */
  public onMessage() {
    return this.messageSubject.asObservable();
  }

  /**
   * Envoyer un message via WebSocket
   */
  public sendMessage(messageDto: { contactId: number,senderId:number, content: string }): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(messageDto)
      });
    } else {
      console.warn('🔌 WebSocket non connecté.');
    }
  }
}
