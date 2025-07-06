import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../interfaces/contact.interface';
import { Message } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // ajuste si besoin

  constructor(private http: HttpClient) { }

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`api/contacts`);
  }

  getMessages(contactId: number, ownerId: number | undefined): Observable<Message[]> {
    return this.http.get<Message[]>(`/messages/${contactId}/${ownerId}`);
  }

  sendMessage(contactId:number,senderId: number, message: String): Observable<Message> {
    return this.http.post<Message>('/messages', {contact_Id:contactId, sender_Id:senderId,content:message});
  }
}
