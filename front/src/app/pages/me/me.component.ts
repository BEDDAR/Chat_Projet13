import { Contact } from './../../interfaces/contact.interface';
import { ChatService } from 'src/app/services/chat.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import { WebSocketService } from 'src/app/services/message.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'src/app/interfaces/message.interface';
import { ChatWebsocketService } from 'src/app/services/chat-websocket.service';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {

  public currentUser: User | undefined;
  public formMe: FormGroup | undefined;
  newMessage: string = '';
  messages: Message[] = [];
  contact: Contact | undefined;
  showChat: boolean = false;

  constructor(private wsService: WebSocketService,
    private chatSocket: ChatWebsocketService,
    private router: Router,
    private sessionService: SessionService,
    private matSnackBar: MatSnackBar,
    private userService: UserService,
    private chatService: ChatService,
    private fb: FormBuilder) {
  }

  public ngOnInit(): void {
    this.userService
      .getById(this.sessionService.sessionInformation!.id.toString())
      .subscribe((user: User) => {
        this.currentUser = user;
        this.initForm();
        this.chatService.getContacts().subscribe(contacts => {
          this.contact = contacts.find(cont => cont.contactUser.id === user.id);

          console.log("contactId", this.contact)
          // 🔔 S'abonner au topic du contact
          if (this.contact) {
            this.chatSocket.subscribeToChat(this.contact.id);
            this.messages = this.contact?.messages
          }

          // 📨 Réception des messages
          this.chatSocket.onMessage().subscribe(message => {
            console.log('Nouveau message reçu :', message);
            this.messages.push(message);
          });

        })
        console.log(this.currentUser)
      });
    ;

  }

  public submit(): void {
    const user = this.formMe?.value as User;

    if (this.currentUser && this.sessionService.sessionInformation?.id) {
      user.id = this.sessionService.sessionInformation?.id
      console.log(user)
      this.userService.update(user)
        .subscribe((_: User) => {
          this.matSnackBar.open("Tes nouvelles informations sont bien enregistrées !", 'Close', { duration: 3000 });
        })
    } else {
      this.matSnackBar.open("Echec d'enregistrement", 'Close', { duration: 3000 });
    }
  }

  initForm(): void {
    console.log(this.currentUser)
    this.formMe = this.fb.group({
      userName: [this.currentUser?.userName],
      email: [this.currentUser?.email,
      [
        Validators.required,
        Validators.email
      ]
      ],
      password: ['',
        [
          Validators.required,
          Validators.min(3)
        ]
      ]
    });
  }

  send(): void {
    if (this.currentUser && this.contact) {
      this.chatService.sendMessage(this.contact.id, this.currentUser.id, this.newMessage).subscribe(() => {
        this.newMessage = '';
      });
    }

  }

  toggleChat() {
    this.showChat = !this.showChat;
  }

  sendMessage(): void {
    if (this.currentUser && this.contact) {
      console.log("Sending message:", {
        contactId: this.contact.id,
        senderId: this.currentUser.id,
        content: this.newMessage
      });

      this.chatSocket.sendMessage({
        contactId: this.contact.id,
        senderId: this.currentUser.id,
        content: this.newMessage
      });
      this.newMessage = '';
    } else {
      console.warn("Impossible d'envoyer le message. Utilisateur ou contact non défini.");
    }
  }

}


