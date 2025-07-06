import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/services/message.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  message: string = '';
  messages: string[] = [];

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.webSocketService.messageStream.subscribe((msg) => {
      this.messages.push(msg);
    });
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.webSocketService.send('/app/chat', { content: this.message });
      this.message = '';
    }
  }
}
