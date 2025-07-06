import { Contact } from './../../interfaces/contact.interface';
import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Message } from 'src/app/interfaces/message.interface';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user.interface';
import { ChatWebsocketService } from 'src/app/services/chat-websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  contacts: Contact[] = [];
  selectedContact: Contact | null = null;
  public currentUser: User | undefined;
  newMessage: string = '';
  messages: Message[] = [];
  private messageSubscription?: Subscription;

  constructor(
    private chatSocket: ChatWebsocketService,
    private chatService: ChatService,
    private sessionService: SessionService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService
      .getById(this.sessionService.sessionInformation!.id.toString())
      .subscribe((user: User) => {
        this.currentUser = user;
        this.contacts = user.contacts;

        // 🔔 S'abonner au topic du contact
        if (this.selectedContact) {
          console.log("contactId", this.selectedContact)
          this.chatSocket.subscribeToChat(this.selectedContact.id);
          console.log('this.messages', this.messages)
        }
      })
    console.log(this.currentUser)
  };

  selectContact(contact: Contact): void {
    if (this.selectedContact) {
      this.chatSocket.unsubscribeFromChat(this.selectedContact.id); // 🧹 désabonne l'ancien contact
      this.messageSubscription?.unsubscribe(); // 🧹 désabonne aussi le message observable
    }

    this.selectedContact = contact;
    this.messages = contact.messages;

    this.chatSocket.subscribeToChat(contact.id); // ✅ abonne le nouveau contact

    // Réabonne à l'observable
    this.messageSubscription = this.chatSocket.onMessage().subscribe((message: Message) => {
      // Vérifie que le message est bien destiné au contact sélectionné

      this.messages.push(message);

    });
  }


  sendMessage(): void {
    if (this.currentUser && this.selectedContact) {
      console.log("Sending message:", {
        contactId: this.selectedContact.id,
        senderId: this.currentUser.id,
        content: this.newMessage
      });
      if (this.newMessage) {
        this.chatSocket.sendMessage({
          contactId: this.selectedContact.id,
          senderId: this.currentUser.id,
          content: this.newMessage
        });
        this.newMessage = '';
      } else {
        console.warn("Impossible d'envoyer le message. Utilisateur ou contact non défini.");
      }
    }
  }

  send(): void {
    if (!this.selectedContact || !this.newMessage.trim()) return;

    if (this.currentUser) {
      this.chatService.sendMessage(this.selectedContact.id, this.currentUser.id, this.newMessage).subscribe(() => {
        this.newMessage = '';
      });
    }
  }

}
